<?php

namespace App\Services\Chatbot;

use App\Models\Chatbot\Chatbot;
use App\Models\Chatbot\ChatbotAction;
use App\Models\Chatbot\ChatbotMessage;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ChatbotService
{
  public function __construct(private GeminiClient $gemini) {}

  public function reply(User $user, Chatbot $chatbot, string $message): array
  {
    set_time_limit(60);

    ChatbotMessage::create(['chatbot_id' => $chatbot->id, 'role' => 'user', 'content' => $message]);

    $systemPrompt = SystemPromptBuilder::build($user);
    $tools = ToolRegistry::toGeminiSchema($user);
    $data = null;

    if ($chatbot->last_interaction_id) {
      $data = $this->gemini->create($message, $systemPrompt, $tools, $chatbot->last_interaction_id);
      if (!$data) {
        Log::warning('Interaction lanjutan gagal, kemungkinan expired', ['chatbot_id' => $chatbot->id]);
      }
    }

    if (!$data) {
      $data = $this->fallbackWithFullHistory($chatbot, $systemPrompt, $tools);
    }

    if (!$data) {
      return $this->finalize($chatbot, 'Maaf, terjadi kesalahan saat menghubungi AI.', null, null);
    }

    return $this->processSteps($user, $chatbot, $data, $systemPrompt, $tools);
  }

  private function fallbackWithFullHistory(Chatbot $chatbot, string $systemPrompt, array $tools): ?array
  {
    $history = $chatbot->messages()->orderBy('created_at')->get();

    $input = $history->map(fn($msg) => [
      'type' => $msg->role === 'assistant' ? 'model_output' : 'user_input',
      'content' => [['type' => 'text', 'text' => $msg->content]],
    ])->toArray();

    return $this->gemini->create($input, $systemPrompt, $tools, null);
  }

  private function processSteps(User $user, Chatbot $chatbot, array $data, string $systemPrompt, array $tools): array
  {
    $functionCallStep = null;
    $text = null;

    foreach ($data['steps'] ?? [] as $step) {
      if ($step['type'] === 'function_call') {
        $functionCallStep = $step;
        break;
      }
      if ($step['type'] === 'model_output') {
        foreach ($step['content'] ?? [] as $block) {
          if ($block['type'] === 'text') {
            $text = $block['text'];
            break 2;
          }
        }
      }
    }

    $interactionId = $data['id'] ?? null;

    if (!$functionCallStep) {
      return $this->finalize($chatbot, $text ?? 'Maaf, terjadi kesalahan.', $interactionId, null);
    }

    $tool = ToolRegistry::find($functionCallStep['name'], $user);
    $args = $functionCallStep['arguments'] ?? [];
    $pendingAction = null;
    $formFields = null;

    if (!$tool) {
      $toolResult = ['error' => 'Anda tidak memiliki akses untuk melakukan aksi ini.'];
    } elseif ($tool->isReadOnly()) {
      $toolResult = $tool->execute($user, $args);
    } else {
      // Cek field wajib yang masih kosong — kalau ada, JANGAN eksekusi/summarize,
      // langsung siapkan form buat user isi lewat UI (lebih cepat & akurat daripada nanya lewat teks).
      $required = $tool->parameters()['required'] ?? [];
      $missing = array_values(array_filter(
        $required,
        fn($field) => !array_key_exists($field, $args) || $args[$field] === null || $args[$field] === '' || (is_array($args[$field]) && empty($args[$field]))
      ));

      if (!empty($missing)) {
        $formFields = $tool->formFields($user, $args);
        $toolResult = [
          'status' => 'form_shown',
          'note' => 'Informasi belum lengkap. Form sudah otomatis ditampilkan ke user. Balas SANGAT singkat (maksimal 1 kalimat), jangan sebutkan field satu-satu.',
        ];
      } else {
        $summary = $tool->summarize($user, $args);
        $pendingAction = ChatbotAction::create([
          'chatbot_id' => $chatbot->id,
          'tool_name' => $tool->name(),
          'payload' => $args,
          'summary' => $summary,
          'status' => 'pending',
        ]);

        $toolResult = [
          'status' => 'draft_created',
          'summary' => $summary,
          'note' => 'Draft sudah disiapkan. Jelaskan singkat, JANGAN bilang sudah tersimpan — tombol konfirmasi otomatis muncul di UI.',
        ];
      }
    }

    $followUpInput = [
      'type' => 'function_result',
      'name' => $functionCallStep['name'],
      'call_id' => $functionCallStep['id'],
      'result' => [['type' => 'text', 'text' => json_encode($toolResult)]],
    ];

    $followUpData = $this->gemini->create($followUpInput, $systemPrompt, $tools, $interactionId);

    if (!$followUpData) {
      return $this->finalize($chatbot, 'Maaf, terjadi kesalahan saat memproses aksi.', $interactionId, $pendingAction, $formFields ? ['tool_name' => $tool->name(), 'fields' => $formFields] : null);
    }

    $followUpText = null;
    foreach ($followUpData['steps'] ?? [] as $step) {
      if ($step['type'] === 'model_output') {
        foreach ($step['content'] ?? [] as $block) {
          if ($block['type'] === 'text') {
            $followUpText = $block['text'];
            break 2;
          }
        }
      }
    }

    $form = $formFields ? ['tool_name' => $tool->name(), 'fields' => $formFields] : null;

    return $this->finalize($chatbot, $followUpText ?? 'Oke.', $followUpData['id'] ?? $interactionId, $pendingAction, $form);
  }

  private function finalize(Chatbot $chatbot, string $text, ?string $interactionId, ?ChatbotAction $action, ?array $form = null): array
  {
    $assistantMessage = ChatbotMessage::create(['chatbot_id' => $chatbot->id, 'role' => 'assistant', 'content' => $text]);

    if ($action) {
      $action->update(['chatbot_message_id' => $assistantMessage->id]);
    }
    if ($interactionId) {
      $chatbot->update(['last_interaction_id' => $interactionId]);
    }
    $chatbot->touch();

    return [
      'reply' => $text,
      'conversation_id' => $chatbot->id,
      'action' => $action ? [
        'id' => $action->id,
        'tool_name' => $action->tool_name,
        'summary' => $action->summary,
        'status' => $action->status,
      ] : null,
      'form' => $form,
    ];
  }
}

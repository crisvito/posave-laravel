<?php

namespace App\Services\Chatbot;

use App\Models\User;
use App\Services\Chatbot\Tools\CreateAdjustmentsTool;
use App\Services\Chatbot\Tools\CreateCategoryTool;
use App\Services\Chatbot\Tools\CreateEmployeeTool;
use App\Services\Chatbot\Tools\CreateInventoryItemTool;
use App\Services\Chatbot\Tools\CreatePurchaseOrderTool;
use App\Services\Chatbot\Tools\CreateTransferTool;
use App\Services\Chatbot\Tools\GetAdjustmentsTool;
use App\Services\Chatbot\Tools\GetCategoriesTool;
use App\Services\Chatbot\Tools\GetEmployeesTool;
use App\Services\Chatbot\Tools\GetFinancialSummaryTool;
use App\Services\Chatbot\Tools\GetInventorySummaryTool;
use App\Services\Chatbot\Tools\GetPageLinkTool;
use App\Services\Chatbot\Tools\GetPurchaseOrderTool;
use App\Services\Chatbot\Tools\GetTransfersTool;
use App\Services\Chatbot\Tools\RespondTransferTool;
use App\Services\Chatbot\Tools\ToolInterface;
use App\Services\Chatbot\Tools\UpdatePurchaseOrderStatusTool;

class ToolRegistry
{
  /** @return ToolInterface[] */
  private static function all(): array
  {
    return [
      new GetInventorySummaryTool(),
      new GetCategoriesTool(),
      new CreateInventoryItemTool(),
      new CreateCategoryTool(),
      new GetPageLinkTool(),
      new GetFinancialSummaryTool(),
      new CreateAdjustmentsTool(),
      new GetAdjustmentsTool(),
      new GetPurchaseOrderTool(),
      new CreatePurchaseOrderTool(),
      new UpdatePurchaseOrderStatusTool(),
      new GetTransfersTool(),
      new CreateTransferTool(),
      new RespondTransferTool(),
      new GetEmployeesTool(),
      new CreateEmployeeTool()
    ];
  }

  /** Tool yang boleh ditawarkan ke user ini — dicek di server, bukan cuma prompt. */
  public static function availableFor(User $user): array
  {
    return array_values(array_filter(self::all(), fn(ToolInterface $t) => $t->isAvailableFor($user)));
  }

  public static function find(string $name, User $user): ?ToolInterface
  {
    foreach (self::availableFor($user) as $tool) {
      if ($tool->name() === $name) {
        return $tool;
      }
    }
    return null;
  }

  public static function toGeminiSchema(User $user): array
  {
    return array_map(fn(ToolInterface $t) => [
      'type' => 'function',
      'name' => $t->name(),
      'description' => $t->description(),
      'parameters' => $t->parameters(),
    ], self::availableFor($user));
  }
}

<?php

use App\Models\Advance\Messaging\Conversation;
use Illuminate\Support\Facades\Broadcast;

// Presence channel untuk conversation — user harus jadi member conversation itu
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::find($conversationId);

    if (!$conversation) return false;

    $isMember = $conversation->members()->where('user_id', $user->id)->exists();

    if (!$isMember) return false;

    return [
        'id'   => $user->id,
        'name' => $user->name,
    ];
});

// Channel broadcast company-wide — user harus dari company itu
Broadcast::channel('company.{companyId}.broadcasts', function ($user, $companyId) {
    return (int) $user->company_id === (int) $companyId;
});

// Channel broadcast per-branch — user harus dari branch itu
Broadcast::channel('branch.{branchId}.broadcasts', function ($user, $branchId) {
    return (int) $user->branch_id === (int) $branchId;
});

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

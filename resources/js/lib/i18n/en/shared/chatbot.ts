const chatbot = {
    trigger: {
        ariaLabel: 'Open chatbot assistant',
        label: 'Ask Your Buddy',
    },
    body: {
        loadingHistory: 'Loading conversation...',
        greetingTitle: 'Hi 👋',
        greetingSubtitleLine1: 'I am POSAVE Smart Assistant',
        greetingSubtitleLine2: 'How can I help you?',
        typing: 'Typing...',
        jumpToLatestAriaLabel: 'Go to latest message',
        jumpToLatestLabel: 'Latest message',
    },
    history: {
        newChatButton: 'New Chat',
        historyLabel: 'History',
        emptyState: 'No conversations yet.',
        renameAriaLabel: 'Rename conversation',
    },
    header: {
        title: 'Smart Assistant',
        subtitle: 'POSAVE AI Assistant',
        openHistoryAriaLabel: 'Open conversation history',
        closeAriaLabel: 'Close chatbot',
    },
    input: {
        placeholder: 'Type a question...',
    },
    conversationMenu: {
        rename: 'Rename',
        delete: 'Delete',
    },
    actionCard: {
        toolLabels: {
            createInventoryItem: 'Add New Item',
        },
        confirming: 'Saving...',
        confirmButton: 'Confirm',
        cancelButton: 'Cancel',
        confirmedLabel: '✓ Saved successfully',
        cancelledLabel: 'Cancelled',
        confirmFailedAlert: 'Failed to run this action, please try again.',
        cancelFailedAlert: 'Failed to cancel, please try again.',
    },
    toolForm: {
        selectPlaceholderPrefix: 'Select',
        preparing: 'Preparing...',
        continueButton: 'Continue',
        submittedLabel: 'Form submitted ✓',
        submitFailedAlert: 'Failed to submit form, please try again.',
    },
};

export default chatbot;
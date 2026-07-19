const chatbot = {
    trigger: {
        ariaLabel: 'Buka asisten chatbot',
        label: 'Tanya Temanmu',
    },
    body: {
        loadingHistory: 'Memuat percakapan...',
        greetingTitle: 'Halo 👋',
        greetingSubtitleLine1: 'Saya Robot Pintar POSAVE',
        greetingSubtitleLine2: 'Ada yang bisa saya bantu?',
        typing: 'Mengetik...',
        jumpToLatestAriaLabel: 'Ke pesan terbaru',
        jumpToLatestLabel: 'Pesan terbaru',
    },
    history: {
        newChatButton: 'Chat Baru',
        historyLabel: 'Riwayat',
        emptyState: 'Belum ada percakapan.',
        renameAriaLabel: 'Ganti nama percakapan',
    },
    header: {
        title: 'Robot Pintar',
        subtitle: 'POSAVE AI Assistant',
        openHistoryAriaLabel: 'Buka riwayat percakapan',
        closeAriaLabel: 'Tutup chatbot',
    },
    input: {
        placeholder: 'Ketik pertanyaan...',
    },
    conversationMenu: {
        rename: 'Ganti Nama',
        delete: 'Hapus',
    },
    actionCard: {
        toolLabels: {
            createInventoryItem: 'Tambah Barang Baru',
        },
        confirming: 'Menyimpan...',
        confirmButton: 'Konfirmasi',
        cancelButton: 'Batal',
        confirmedLabel: '✓ Berhasil disimpan',
        cancelledLabel: 'Dibatalkan',
        confirmFailedAlert: 'Gagal menjalankan aksi, coba lagi.',
        cancelFailedAlert: 'Gagal membatalkan, coba lagi.',
    },
    toolForm: {
        selectPlaceholderPrefix: 'Pilih',
        preparing: 'Menyiapkan...',
        continueButton: 'Lanjutkan',
        submittedLabel: 'Form terkirim ✓',
        submitFailedAlert: 'Gagal mengirim form, coba lagi.',
    },
};

export default chatbot;
<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'name_id' => 'Umum',
                'name_en' => 'General',
                'slug' => 'general',
                'sort_order' => 1,
                'faqs' => [
                    [
                        'question_id' => 'Apa itu Posave?',
                        'question_en' => 'What is Posave?',
                        'answer_id'   => 'Posave adalah aplikasi manajemen toko berbasis AI yang dirancang khusus untuk UMKM Indonesia. Kamu bisa mencatat transaksi, memantau stok, dan melihat laporan hanya dengan mengetik perintah seperti chat biasa.',
                        'answer_en'   => 'Posave is an AI-based store management application designed specifically for Indonesian MSMEs. You can record transactions, monitor inventory, and view reports simply by typing commands like a regular chat.',
                        'sort_order' => 1,
                    ],
                    [
                        'question_id' => 'Apakah Posave terpercaya?',
                        'question_en' => 'Is Posave trusted?',
                        'answer_id'   => 'Ya. Data kamu tersimpan secara aman di server kami dengan enkripsi standar industri. Kami tidak menjual atau membagikan data pengguna kepada pihak ketiga.',
                        'answer_en'   => 'Yes. Your data is securely stored on our servers with industry-standard encryption. We do not sell or share user data with third parties.',
                        'sort_order' => 2,
                    ],
                    [
                        'question_id' => 'Kenapa harus Posave?',
                        'question_en' => 'Why should I choose Posave?',
                        'answer_id'   => 'Posave satu-satunya aplikasi kasir di Indonesia yang menggunakan AI untuk menerima input dalam bahasa natural. Tidak perlu pelatihan, tidak perlu hardware mahal — cukup smartphone yang kamu punya sekarang.',
                        'answer_en'   => 'Posave is the only cash register application in Indonesia that uses AI to receive input in natural language. No training needed, no expensive hardware required — just the smartphone you already have.',
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'name_id' => 'Akun',
                'name_en' => 'Account',
                'slug' => 'account',
                'sort_order' => 2,
                'faqs' => [
                    [
                        'question_id' => 'Bagaimana cara mendaftar akun Posave?',
                        'question_en' => 'How do I sign up for a Posave account?',
                        'answer_id'   => 'Klik tombol "Daftar" di halaman utama, isi nama, email, dan nomor HP kamu. Verifikasi via OTP, lalu buat toko pertamamu dalam 5 menit.',
                        'answer_en'   => 'Click the "Sign Up" button on the main page, fill in your name, email, and phone number. Verify via OTP, then create your first store in 5 minutes.',
                        'sort_order' => 1,
                    ],
                    [
                        'question_id' => 'Bisakah satu akun dipakai di beberapa toko?',
                        'question_en' => 'Can one account be used in multiple stores?',
                        'answer_id'   => 'Bisa. Satu akun owner bisa mengelola beberapa cabang sekaligus. Masing-masing cabang punya data terpisah dan bisa diassign ke kepala toko yang berbeda.',
                        'answer_en'   => 'Yes. One owner account can manage multiple branches at the same time. Each branch has separate data and can be assigned to different store managers.',
                        'sort_order' => 2,
                    ],
                    [
                        'question_id' => 'Bagaimana jika lupa password?',
                        'question_en' => 'How do I reset my password?',
                        'answer_id'   => 'Klik "Lupa Password" di halaman login, masukkan email kamu, dan ikuti instruksi reset password yang dikirim ke email tersebut.',
                        'answer_en'   => 'Click "Forgot Password" on the login page, enter your email, and follow the password reset instructions sent to your email.',
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'name_id' => 'Pembayaran',
                'name_en' => 'Payment',
                'slug' => 'payment',
                'sort_order' => 3,
                'faqs' => [
                    [
                        'question_id' => 'Apakah Posave gratis?',
                        'question_en' => 'Is Posave free?',
                        'answer_id'   => 'Posave tersedia dalam versi Lite (gratis) dan Pro (berbayar). Versi Lite sudah mencakup fitur AI chatbot dasar, transaksi, dan manajemen stok untuk satu toko.',
                        'answer_en'   => 'Posave is available in Lite (free) and Pro (paid) versions. The Lite version already includes basic AI chatbot features, transactions, and inventory management for one store.',
                        'sort_order' => 1,
                    ],
                    [
                        'question_id' => 'Metode pembayaran apa yang diterima?',
                        'question_en' => 'What payment methods do you accept?',
                        'answer_id'   => 'Kami menerima transfer bank, kartu kredit/debit, dan dompet digital seperti GoPay, OVO, dan Dana untuk pembayaran langganan Pro.',
                        'answer_en'   => 'We accept bank transfers, credit/debit cards, and digital wallets like GoPay, OVO, and Dana for Pro subscription payments.',
                        'sort_order' => 2,
                    ],
                ],
            ],
            [
                'name_id' => 'Keamanan',
                'name_en' => 'Security',
                'slug' => 'security',
                'sort_order' => 4,
                'faqs' => [
                    [
                        'question_id' => 'Apakah data transaksi saya aman?',
                        'question_en' => 'Is my transaction data secure?',
                        'answer_id'   => 'Semua data dienkripsi menggunakan AES-256 dan disimpan di server yang berlokasi di Indonesia. Kami rutin melakukan backup harian untuk mencegah kehilangan data.',
                        'answer_en'   => 'All data is encrypted using AES-256 and stored on servers located in Indonesia. We perform daily backups to prevent data loss.',
                        'sort_order' => 1,
                    ],
                    [
                        'question_id' => 'Bisakah saya membatasi akses staf?',
                        'question_en' => 'Can I limit staff access?',
                        'answer_id'   => 'Bisa. Posave punya sistem role: Owner, Kepala Toko, dan Kasir. Setiap role punya batasan akses yang berbeda — kasir hanya bisa input transaksi, sementara owner bisa melihat seluruh laporan cabang.',
                        'answer_en'   => 'Yes. Posave has a role-based system: Owner, Store Manager, and Cashier. Each role has different access limitations — the cashier can only input transactions, while the owner can view all branch reports.',
                        'sort_order' => 2,
                    ],
                ],
            ],
            [
                'name_id' => 'Bantuan',
                'name_en' => 'Help',
                'slug' => 'help',
                'sort_order' => 5,
                'faqs' => [
                    [
                        'question_id' => 'Bagaimana cara menghubungi tim support Posave?',
                        'question_en' => 'How do I contact the Posave support team?',
                        'answer_id'   => 'Kamu bisa menghubungi kami via email di support@posave.com, WhatsApp di +62 811 2345 567, atau langsung lewat fitur chat di aplikasi.',
                        'answer_en'   => 'You can contact us via email at support@posave.com, WhatsApp at +62 811 2345 567, or directly through the chat feature in the app.',
                        'sort_order' => 1,
                    ],
                    [
                        'question_id' => 'Apakah ada panduan penggunaan aplikasi?',
                        'question_en' => 'Is there a user guide for the application?',
                        'answer_id'   => 'Ya, kami menyediakan dokumentasi lengkap, video tutorial, dan artikel panduan di halaman Artikel. Kamu juga bisa langsung tanya ke AI assistant di dalam aplikasi.',
                        'answer_en'   => 'Yes, we provide comprehensive documentation, video tutorials, and guide articles on the Articles page. You can also directly ask our AI assistant within the app.',
                        'sort_order' => 2,
                    ],
                ],
            ],
        ];

        foreach ($data as $categoryData) {
            $category = FaqCategory::create([
                'name_id'       => $categoryData['name_id'],
                'name_en'       => $categoryData['name_en'],
                'slug'       => $categoryData['slug'],
                'sort_order' => $categoryData['sort_order'],
            ]);

            foreach ($categoryData['faqs'] as $faqData) {
                Faq::create([
                    'faq_category_id' => $category->id,
                    'question_id'        => $faqData['question_id'],
                    'question_en'        => $faqData['question_en'],
                    'answer_id'          => $faqData['answer_id'],
                    'answer_en'          => $faqData['answer_en'],
                    'sort_order'      => $faqData['sort_order'],
                    'is_active'       => true,
                ]);
            }
        }
    }
}

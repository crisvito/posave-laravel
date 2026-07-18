<?php

namespace Database\Seeders;

use App\Models\CompanyPage\Faq;
use App\Models\CompanyPage\FaqCategory;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'name' => 'Umum',
                'name_en' => 'General',
                'slug' => 'umum',
                'sort_order' => 1,
                'faqs' => [
                    [
                        'question' => 'Apa itu Posave?',
                        'question_en' => 'What is Posave?',
                        'answer'   => 'Posave adalah aplikasi manajemen toko berbasis AI yang dirancang khusus untuk UMKM Indonesia. Kamu bisa mencatat transaksi, memantau stok, dan melihat laporan hanya dengan mengetik perintah seperti chat biasa.',
                        'answer_en' => 'Posave is an AI-powered store management app built specifically for Indonesian small and medium businesses. You can record transactions, track stock, and view reports just by typing commands like a normal chat.',
                        'sort_order' => 1,
                    ],
                    [
                        'question' => 'Apakah Posave terpercaya?',
                        'question_en' => 'Is Posave trustworthy?',
                        'answer'   => 'Ya. Data kamu tersimpan secara aman di server kami dengan enkripsi standar industri. Kami tidak menjual atau membagikan data pengguna kepada pihak ketiga.',
                        'answer_en' => 'Yes. Your data is stored securely on our servers with industry-standard encryption. We never sell or share user data with third parties.',
                        'sort_order' => 2,
                    ],
                    [
                        'question' => 'Kenapa harus Posave?',
                        'question_en' => 'Why choose Posave?',
                        'answer'   => 'Posave satu-satunya aplikasi kasir di Indonesia yang menggunakan AI untuk menerima input dalam bahasa natural. Tidak perlu pelatihan, tidak perlu hardware mahal — cukup smartphone yang kamu punya sekarang.',
                        'answer_en' => 'Posave is the only POS app in Indonesia that uses AI to accept input in natural language. No training needed, no expensive hardware required — just the smartphone you already have.',
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'name' => 'Akun',
                'name_en' => 'Account',
                'slug' => 'akun',
                'sort_order' => 2,
                'faqs' => [
                    [
                        'question' => 'Bagaimana cara mendaftar akun Posave?',
                        'question_en' => 'How do I register a Posave account?',
                        'answer'   => 'Klik tombol "Daftar" di halaman utama, isi nama, email, dan nomor HP kamu. Verifikasi via OTP, lalu buat toko pertamamu dalam 5 menit.',
                        'answer_en' => 'Click the "Register" button on the homepage, fill in your name, email, and phone number. Verify via OTP, then set up your first store in 5 minutes.',
                        'sort_order' => 1,
                    ],
                    [
                        'question' => 'Bisakah satu akun dipakai di beberapa toko?',
                        'question_en' => 'Can one account be used for multiple stores?',
                        'answer'   => 'Bisa. Satu akun owner bisa mengelola beberapa cabang sekaligus. Masing-masing cabang punya data terpisah dan bisa diassign ke kepala toko yang berbeda.',
                        'answer_en' => 'Yes. One owner account can manage multiple branches at once. Each branch has separate data and can be assigned to a different branch manager.',
                        'sort_order' => 2,
                    ],
                    [
                        'question' => 'Bagaimana jika lupa password?',
                        'question_en' => 'What if I forget my password?',
                        'answer'   => 'Klik "Lupa Password" di halaman login, masukkan email kamu, dan ikuti instruksi reset password yang dikirim ke email tersebut.',
                        'answer_en' => 'Click "Forgot Password" on the login page, enter your email, and follow the password reset instructions sent to that email.',
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'name' => 'Pembayaran',
                'name_en' => 'Payment',
                'slug' => 'pembayaran',
                'sort_order' => 3,
                'faqs' => [
                    [
                        'question' => 'Apakah Posave gratis?',
                        'question_en' => 'Is Posave free?',
                        'answer'   => 'Posave tersedia dalam versi Lite (gratis) dan Pro (berbayar). Versi Lite sudah mencakup fitur AI chatbot dasar, transaksi, dan manajemen stok untuk satu toko.',
                        'answer_en' => 'Posave is available in Lite (free) and Pro (paid) versions. The Lite version already includes basic AI chatbot features, transactions, and stock management for one store.',
                        'sort_order' => 1,
                    ],
                    [
                        'question' => 'Metode pembayaran apa yang diterima?',
                        'question_en' => 'What payment methods are accepted?',
                        'answer'   => 'Kami menerima transfer bank, kartu kredit/debit, dan dompet digital seperti GoPay, OVO, dan Dana untuk pembayaran langganan Pro.',
                        'answer_en' => 'We accept bank transfer, credit/debit cards, and e-wallets such as GoPay, OVO, and Dana for Pro subscription payments.',
                        'sort_order' => 2,
                    ],
                ],
            ],
            [
                'name' => 'Keamanan',
                'name_en' => 'Security',
                'slug' => 'keamanan',
                'sort_order' => 4,
                'faqs' => [
                    [
                        'question' => 'Apakah data transaksi saya aman?',
                        'question_en' => 'Is my transaction data safe?',
                        'answer'   => 'Semua data dienkripsi menggunakan AES-256 dan disimpan di server yang berlokasi di Indonesia. Kami rutin melakukan backup harian untuk mencegah kehilangan data.',
                        'answer_en' => 'All data is encrypted using AES-256 and stored on servers located in Indonesia. We perform daily backups to prevent data loss.',
                        'sort_order' => 1,
                    ],
                    [
                        'question' => 'Bisakah saya membatasi akses staf?',
                        'question_en' => 'Can I restrict staff access?',
                        'answer'   => 'Bisa. Posave punya sistem role: Owner, Kepala Toko, dan Kasir. Setiap role punya batasan akses yang berbeda — kasir hanya bisa input transaksi, sementara owner bisa melihat seluruh laporan cabang.',
                        'answer_en' => 'Yes. Posave has a role system: Owner, Branch Manager, and Cashier. Each role has different access restrictions — cashiers can only input transactions, while owners can view reports for all branches.',
                        'sort_order' => 2,
                    ],
                ],
            ],
            [
                'name' => 'Bantuan',
                'name_en' => 'Help',
                'slug' => 'bantuan',
                'sort_order' => 5,
                'faqs' => [
                    [
                        'question' => 'Bagaimana cara menghubungi tim support Posave?',
                        'question_en' => 'How do I contact the Posave support team?',
                        'answer'   => 'Kamu bisa menghubungi kami via email di support@posave.com, WhatsApp di +62 811 2345 567, atau langsung lewat fitur chat di aplikasi.',
                        'answer_en' => 'You can reach us via email at support@posave.com, WhatsApp at +62 811 2345 567, or directly through the in-app chat feature.',
                        'sort_order' => 1,
                    ],
                    [
                        'question' => 'Apakah ada panduan penggunaan aplikasi?',
                        'question_en' => 'Is there a user guide for the app?',
                        'answer'   => 'Ya, kami menyediakan dokumentasi lengkap, video tutorial, dan artikel panduan di halaman Artikel. Kamu juga bisa langsung tanya ke AI assistant di dalam aplikasi.',
                        'answer_en' => 'Yes, we provide complete documentation, video tutorials, and guide articles on the Articles page. You can also ask the AI assistant directly within the app.',
                        'sort_order' => 2,
                    ],
                ],
            ],
        ];

        foreach ($data as $categoryData) {
            $category = FaqCategory::create([
                'name'       => $categoryData['name'],
                'name_en'    => $categoryData['name_en'],
                'slug'       => $categoryData['slug'],
                'sort_order' => $categoryData['sort_order'],
            ]);

            foreach ($categoryData['faqs'] as $faqData) {
                Faq::create([
                    'faq_category_id' => $category->id,
                    'question'        => $faqData['question'],
                    'question_en'     => $faqData['question_en'],
                    'answer'          => $faqData['answer'],
                    'answer_en'       => $faqData['answer_en'],
                    'sort_order'      => $faqData['sort_order'],
                    'is_active'       => true,
                ]);
            }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Testimonial::create([
            'name' => 'I Wayan Maha Arcaya',
            'position' => 'CEO',
            'company' => 'Serona',
            'photo' => '/assets/landing-page/testi1.png',
            'logo' => '/assets/landing-page/serona.png',
            'message_id' => 'POSAVE membantu kami memantau transaksi dan stok lebih cepat tanpa proses yang rumit. Dashboardnya juga mudah dipahami oleh tim kami.',
            'message_en' => 'POSAVE helps us monitor transactions and stock faster without complicated processes. The dashboard is also easy for our team to understand.',
        ]);

        Testimonial::create([
            'name' => 'Vincent Fernandes',
            'position' => 'CEO',
            'company' => 'Viktorifit',
            'photo' => '/assets/landing-page/testi2.jpg',
            'logo' => '/assets/landing-page/viktorifit.png',
            'message_id' => 'POSAVE membantu operasional bisnis kami menjadi lebih efisien. Monitoring transaksi, stok, dan laporan kini dapat dilakukan dengan cepat dalam satu dashboard.',
            'message_en' => 'POSAVE helps us make our business operations more efficient. Monitoring transactions, stock, and reports can now be done quickly within a single dashboard.',
        ]);

        Testimonial::create([
            'name' => 'Crisvito',
            'position' => 'Founder',
            'company' => 'Viktorifit',
            'photo' => '/assets/landing-page/testi3.jpeg',
            'logo' => '/assets/landing-page/viktorifit.png',
            'message_id' => 'POSAVE membantu kami mengelola operasional bisnis dengan lebih efisien. Monitoring transaksi dan laporan kini menjadi lebih cepat dan praktis.',
            'message_en' => 'POSAVE helps us manage our business operations more efficiently. Monitoring transactions and reports is now faster and more practical.',
        ]);
    }
}

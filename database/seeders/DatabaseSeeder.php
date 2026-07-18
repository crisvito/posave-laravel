<?php

namespace Database\Seeders;

use App\Models\Auth\Company;
use App\Models\Auth\CompanyProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Pemilik "Berkah Mart" — akun uji: test@example.com / password.
        $owner = User::factory()->create([
            'name' => 'Budi Hartono',
            'email' => 'test@example.com',
            'role' => 'owner',
        ]);

        $company = Company::create([
            'owner_id' => $owner->id,
            'type' => 'advance',
        ]);

        // Identitas usaha (dipakai halaman Pengaturan Profil Usaha & kop laporan).
        CompanyProfile::create([
            'company_id' => $company->id,
            'name' => 'Berkah Mart',
            'address' => 'Jl. Merdeka No. 10',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Pusat',
            'zip' => '10110',
            'phone' => '021-5550101',
            'whatsapp' => '0812-9000-1234',
            'website' => 'https://berkahmart.example',
        ]);

        // Tandai owner sudah onboarding (punya company) agar bisa langsung masuk dashboard.
        $owner->update(['company_id' => $company->id]);

        $this->call([
            TestimonialSeeder::class,
            FaqSeeder::class,
            DemoSeeder::class,
            ArticleCategorySeeder::class,
            ArticleSeeder::class
        ]);
    }
}

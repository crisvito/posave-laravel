# Posave

> **Modern Point of Sale for Small Businesses**

POSave adalah aplikasi **Point of Sale (POS)** berbasis web yang dirancang untuk membantu UMKM mengelola operasional toko dengan lebih mudah, mulai dari transaksi, inventory, cabang, karyawan, hingga laporan bisnis.

POSave hadir dengan dua pengalaman penggunaan:

- **Advance Mode** — untuk bisnis yang membutuhkan pengelolaan operasional lebih lengkap.
- **Lite Mode** — untuk toko kecil yang membutuhkan POS sederhana dan cepat.

POSave juga dilengkapi dengan **AI-powered assistant** yang dapat membantu pengguna memahami data dan menjalankan beberapa tindakan melalui antarmuka POS.

---

## ✨ Features

### 🧾 Point of Sale

- Transaksi penjualan
- Multiple product items dalam satu transaksi
- Discount
- Payment method
- Invoice generation
- Transaction history
- Refund support
- Transaction rounding

### 📦 Inventory Management

- Product management
- Category management
- Branch stock
- Minimum stock monitoring
- Stock adjustment
- Stock history
- Cost & selling price management

### 🏪 Multi-Branch Management

POSave mendukung pengelolaan beberapa cabang dalam satu perusahaan.

Setiap cabang dapat memiliki:

- Branch manager
- Cashiers
- Individual stock
- Branch-specific transactions
- Branch group conversation

### 👥 Employee Management

Role yang tersedia meliputi:

- Owner
- Branch Manager
- Cashier

Setiap employee dapat dikaitkan dengan perusahaan dan cabang tertentu.

### 📊 Business Dashboard

Dashboard menyediakan informasi mengenai aktivitas bisnis dan transaksi sehingga pemilik toko dapat memahami kondisi bisnis dengan lebih cepat.

### 🤖 AI Assistant

POSave menyediakan AI assistant untuk membantu pengguna berinteraksi dengan sistem menggunakan bahasa natural.

AI dapat digunakan untuk membantu:

- Memahami informasi bisnis
- Menganalisis data
- Mendapatkan insight
- Menjalankan action tertentu pada POS

### 💬 Real-Time Communication

POSave menggunakan **Laravel Reverb** untuk kebutuhan komunikasi realtime, termasuk fitur percakapan antar pengguna.

### 🔐 Authentication

Sistem authentication mendukung:

- Email & password
- Google OAuth
- Role-based access
- Email verification

### 📱 Responsive Web Application

POSave dirancang sebagai aplikasi web yang dapat digunakan melalui berbagai ukuran layar dan perangkat.

---

## 🌓 Advance & Lite Mode

POSave memiliki dua mode utama yang disesuaikan dengan kebutuhan bisnis.

### Advance Mode

Ditujukan untuk bisnis yang memiliki kebutuhan operasional lebih kompleks.

Contohnya:

- Multiple branches
- Employee management
- Inventory management
- Business reports
- Advanced dashboard
- AI assistant
- Real-time communication

### Lite Mode

Ditujukan untuk toko kecil yang membutuhkan workflow POS yang lebih sederhana.

Lite Mode mengurangi kompleksitas fitur sehingga pengguna dapat langsung fokus pada:

**Product → Stock → Transaction**

---

## 🛠️ Tech Stack

### Backend

- [Laravel 12](https://laravel.com/)
- PHP 8.2+
- MySQL
- Laravel Reverb
- Laravel Socialite
- Laravel DomPDF
- Laravel Excel

### Frontend

- React 19
- TypeScript
- Inertia.js 2
- Tailwind CSS 4
- Vite
- Framer Motion
- Zustand
- Recharts
- Radix UI
- Lucide React

### AI & Real-Time

- Google Gemini API
- Laravel Reverb
- Laravel Echo
- Pusher JS

---

## 📋 Requirements

Sebelum menjalankan POSave, pastikan environment berikut sudah tersedia:

| Requirement | Version            |
| ----------- | ------------------ |
| PHP         | 8.2+               |
| Composer    | 2.x                |
| Node.js     | 20+                |
| npm         | 10+                |
| MySQL       | 8.0+ / compatible  |
| Git         | Latest recommended |

---

## 🚀 Quick Start

Clone repository:

```bash
git clone https://github.com/crisvito/posave-laravel.git
cd posave-laravel
```

Install backend dependencies:

```bash
composer install
```

Install frontend dependencies:

```bash
npm install
```

Copy environment file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Configure database dan environment variables pada `.env`.

Kemudian jalankan migration dan demo seeder:

```bash
php artisan migrate --seed
```

Terakhir, jalankan aplikasi:

```bash
composer run dev
```

Aplikasi dapat diakses melalui:

```text
http://localhost:8000
```

> Untuk konfigurasi local development yang lebih lengkap, lihat [Local Development Setup](docs/LOCAL_SETUP.md).

---

## 👤 Demo Accounts

Seeder menyediakan dua contoh perusahaan:

### Advance

**Owner**

```text
Email    : owner.advance@posave.test
Password : password
```

**Branch Manager — Cabang Utama**

```text
Email    : manager.cabang-utama@posave.test
Password : password
```

**Branch Manager — Cabang Kedua**

```text
Email    : manager.cabang-kedua@posave.test
Password : password
```

**Cashier — Cabang Utama**

```text
Email    : andi.cabang-utama@posave.test
Password : password
```

```text
Email    : bintang.cabang-utama@posave.test
Password : password
```

**Cashier — Cabang Kedua**

```text
Email    : andi.cabang-kedua@posave.test
Password : password
```

```text
Email    : bintang.cabang-kedua@posave.test
Password : password
```

### Lite

**Owner / Cashier**

```text
Email    : owner.lite@posave.test
Password : password
```

Seeder juga membuat sample:

- Product categories
- Products
- Branch stock
- Stock adjustments
- Sales transactions
- Transaction items
- Branch group conversations

Data transaksi demo dibuat untuk **7 hari terakhir** sehingga dashboard dan laporan dapat langsung digunakan setelah setup selesai.

---

## 🗂️ Project Structure

Struktur utama aplikasi:

```text
app/
├── Http/
├── Models/
├── Services/
└── ...

database/
├── migrations/
└── seeders/

resources/
├── js/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── types/
└── ...

routes/
├── web.php
└── ...

docs/
└── LOCAL_SETUP.md
```

---

## 🔄 Development Workflow

Untuk menjalankan seluruh development process:

```bash
composer run dev
```

Command tersebut menjalankan beberapa proses secara bersamaan:

```text
Laravel Server
Queue Worker
Vite Development Server
```

Jika ingin menjalankan proses secara manual, gunakan terminal terpisah:

```bash
php artisan serve
```

```bash
php artisan queue:listen --tries=1
```

```bash
npm run dev
```

---

## 🧪 Database

Untuk setup database baru:

```bash
php artisan migrate --seed
```

Jika ingin menghapus seluruh database dan membuat ulang seluruh data demo:

```bash
php artisan migrate:fresh --seed
```

> `migrate:fresh --seed` akan menghapus seluruh tabel beserta data yang ada. Gunakan hanya untuk development.

---

## 🎨 Code Formatting

Format frontend:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Lint:

```bash
npm run lint
```

Laravel code formatting:

```bash
./vendor/bin/pint
```

---

## 📚 Documentation

Dokumentasi teknis dan setup tersedia di:

- [Local Development Setup](docs/LOCAL_SETUP.md)
- [Deploy Development Setup](docs/DEPLOY_SETUP.md)

---

## 🔒 Environment Variables

Environment variables bersifat lokal dan **tidak boleh di-commit ke repository**.

Gunakan:

```text
.env
```

untuk konfigurasi pribadi dan:

```text
.env.example
```

sebagai template konfigurasi.

Jangan menyimpan:

- API keys
- OAuth client secrets
- SMTP passwords
- Reverb secrets
- Application keys

ke dalam repository.

---

## 📄 License

This project is licensed under the MIT License.

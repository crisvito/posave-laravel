# POSave — Local Development Setup

## 1. Overview

Dokumen ini menjelaskan prosedur untuk menjalankan aplikasi POSave pada lingkungan local development.

Deployment ke production tidak termasuk dalam dokumen ini.

---

## 2. System Requirements

Pastikan perangkat telah memiliki:

- PHP 8.2 atau lebih baru
- Composer 2.x
- Node.js 20 atau lebih baru
- npm
- MySQL 8.0 atau compatible version
- Git

PHP juga harus memiliki extension yang dibutuhkan oleh Laravel dan dependency aplikasi.

---

## 3. Clone Repository

Clone repository POSave:

```bash
git clone https://github.com/crisvito/posave-laravel.git
```

Masuk ke directory project:

```bash
cd posave-laravel
```

---

## 4. Install Dependencies

Install dependency PHP:

```bash
composer install
```

Install dependency JavaScript:

```bash
npm install
```

---

## 5. Environment Configuration

Salin file environment example:

```bash
cp .env.example .env
```

Pada Windows PowerShell, dapat digunakan:

```powershell
Copy-Item .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

---

## 6. Database Configuration

Buat database MySQL untuk POSave.

Contoh:

```text
Database : posave
Username : root
Password :
Host     : 127.0.0.1
Port     : 3306
```

Kemudian sesuaikan konfigurasi berikut pada `.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=posave
DB_USERNAME=root
DB_PASSWORD=
```

Pastikan MySQL sedang berjalan sebelum menjalankan migration.

---

## 7. Migration and Seeding

Setelah database dikonfigurasi, jalankan:

```bash
php artisan migrate --seed
```

Command tersebut akan:

1. Membuat tabel database melalui migration.
2. Menjalankan seeder utama.
3. Membuat sample company Advance.
4. Membuat sample company Lite.
5. Membuat branch.
6. Membuat employee.
7. Membuat product category.
8. Membuat product.
9. Membuat branch stock.
10. Membuat stock adjustment.
11. Membuat sample transaction.
12. Membuat branch group conversation.

Seeder menggunakan dua owner demo:

```text
owner.advance@posave.test
owner.lite@posave.test
```

Password seluruh akun demo:

```text
password
```

Data transaksi demo dibuat untuk 7 hari terakhir.

---

## 8. Demo Accounts

### Advance

| Role                          | Email                                                                       | Password |
| ----------------------------- | --------------------------------------------------------------------------- | -------- |
| Owner                         | [owner.advance@posave.test](mailto:owner.advance@posave.test)               | password |
| Branch Manager — Cabang Utama | [manager.cabang-utama@posave.test](mailto:manager.cabang-utama@posave.test) | password |
| Branch Manager — Cabang Kedua | [manager.cabang-kedua@posave.test](mailto:manager.cabang-kedua@posave.test) | password |
| Cashier — Cabang Utama        | [andi.cabang-utama@posave.test](mailto:andi.cabang-utama@posave.test)       | password |
| Cashier — Cabang Utama        | [bintang.cabang-utama@posave.test](mailto:bintang.cabang-utama@posave.test) | password |
| Cashier — Cabang Kedua        | [andi.cabang-kedua@posave.test](mailto:andi.cabang-kedua@posave.test)       | password |
| Cashier — Cabang Kedua        | [bintang.cabang-kedua@posave.test](mailto:bintang.cabang-kedua@posave.test) | password |

### Lite

| Role            | Email                                                   | Password |
| --------------- | ------------------------------------------------------- | -------- |
| Owner / Cashier | [owner.lite@posave.test](mailto:owner.lite@posave.test) | password |

---

## 9. Additional Environment Configuration

Beberapa fitur POSave membutuhkan environment variable tambahan.

### Gemini

AI assistant membutuhkan:

```dotenv
GEMINI_API_KEY=your-gemini-api-key
```

Gunakan API key milik environment local masing-masing.

### Google OAuth

Untuk authentication menggunakan Google:

```dotenv
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
```

Google OAuth credentials harus dikonfigurasi pada Google Cloud project yang digunakan.

### Laravel Reverb

Untuk fitur realtime:

```dotenv
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=local
REVERB_APP_KEY=local-key
REVERB_APP_SECRET=local-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

Reverb akan dijalankan melalui development process yang disediakan oleh Composer.

---

## 10. Run the Application

Setelah seluruh konfigurasi selesai, jalankan:

```bash
composer run dev
```

Script tersebut menjalankan:

```text
Laravel development server
Queue listener
Vite development server
```

Aplikasi Laravel:

```text
http://localhost:8000
```

Vite akan berjalan sebagai development asset server.

---

## 11. Manual Development Processes

Apabila diperlukan, proses development dapat dijalankan secara terpisah.

### Laravel

```bash
php artisan serve
```

### Queue

```bash
php artisan queue:listen --tries=1
```

### Vite

```bash
npm run dev
```

### Reverb

Apabila Reverb perlu dijalankan secara manual:

```bash
php artisan reverb:start
```

---

## 12. Reset Database

Untuk menghapus seluruh data database dan menjalankan ulang migration serta seeder:

```bash
php artisan migrate:fresh --seed
```

**Perhatian:** command tersebut akan menghapus seluruh data pada database yang digunakan oleh aplikasi.

Command ini hanya direkomendasikan untuk local development.

---

## 13. Frontend Development

Perubahan pada frontend dapat dikembangkan menggunakan:

```bash
npm run dev
```

Untuk membuat production build:

```bash
npm run build
```

---

## 14. Code Quality

### Prettier

Format frontend:

```bash
npm run format
```

Memeriksa formatting:

```bash
npm run format:check
```

### ESLint

```bash
npm run lint
```

### Laravel Pint

```bash
./vendor/bin/pint
```

---

## 15. Environment Security

File `.env` tidak boleh di-commit ke repository.

Environment file hanya digunakan untuk menyimpan konfigurasi local atau environment tertentu.

Informasi berikut tidak boleh dimasukkan ke source control:

- Application key
- API keys
- OAuth client secret
- SMTP credentials
- Reverb secret
- Database passwords

Gunakan `.env.example` sebagai template konfigurasi tanpa credential sensitif.

---

## 16. Troubleshooting

### Database connection error

Pastikan:

1. MySQL sedang berjalan.
2. Database `posave` sudah dibuat.
3. Username dan password pada `.env` benar.
4. Port MySQL sesuai dengan konfigurasi.

Kemudian jalankan kembali:

```bash
php artisan migrate --seed
```

### Frontend tidak berubah

Pastikan Vite sedang berjalan:

```bash
npm run dev
```

Atau jalankan seluruh development environment:

```bash
composer run dev
```

### Environment configuration tidak terbaca

Setelah mengubah `.env`, bersihkan configuration cache:

```bash
php artisan config:clear
```

Kemudian jalankan kembali aplikasi.

---

## 17. Development Command Summary

| Command                            | Purpose                                    |
| ---------------------------------- | ------------------------------------------ |
| `composer install`                 | Install PHP dependencies                   |
| `npm install`                      | Install frontend dependencies              |
| `php artisan key:generate`         | Generate application key                   |
| `php artisan migrate --seed`       | Migration + demo data                      |
| `php artisan migrate:fresh --seed` | Reset database + demo data                 |
| `composer run dev`                 | Run complete local development environment |
| `php artisan serve`                | Run Laravel server                         |
| `npm run dev`                      | Run Vite                                   |
| `php artisan reverb:start`         | Run Reverb manually                        |
| `npm run build`                    | Build frontend assets                      |
| `npm run format`                   | Format frontend                            |
| `npm run lint`                     | Run ESLint                                 |
| `./vendor/bin/pint`                | Format PHP code                            |

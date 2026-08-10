# Deployment POSave ke Production

Dokumen ini merangkum langkah-langkah deploy POSave ke server production (VM Linux Ubuntu 24.04 LTS), termasuk setup web server, WebSocket (Reverb), proses background (queue worker), dan SSL. Contoh di dokumen ini menggunakan Azure VM, tapi langkahnya berlaku umum untuk VPS Linux Ubuntu manapun.

## Prasyarat

- VM Ubuntu 24.04 LTS dengan akses root/sudo via SSH
- Domain yang sudah diarahkan (DNS A record) ke IP publik VM
- Repository POSave sudah di-push ke GitHub

## 1. Setup Server Dasar

SSH ke server, lalu update sistem dan install seluruh stack yang dibutuhkan:

```bash
sudo apt update && sudo apt upgrade -y

# PHP 8.3 + ekstensi yang dibutuhkan Laravel
sudo apt install -y php8.3 php8.3-fpm php8.3-cli php8.3-mysql php8.3-mbstring \
  php8.3-xml php8.3-bcmath php8.3-curl php8.3-zip php8.3-gd php8.3-intl unzip

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Nginx
sudo apt install -y nginx

# MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Supervisor (buat manage proses Reverb & queue worker)
sudo apt install -y supervisor
```

## 2. Setup Database

```bash
sudo mysql
```

```sql
CREATE DATABASE posave;
CREATE USER 'posave_user'@'localhost' IDENTIFIED BY 'GANTI_DENGAN_PASSWORD_KUAT';
GRANT ALL PRIVILEGES ON posave.* TO 'posave_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Deploy Kode

```bash
sudo mkdir -p /var/www/posave
sudo chown $USER:$USER /var/www/posave
cd /var/www
git clone https://github.com/crisvito/posave-laravel.git posave
cd posave

composer install --no-dev --optimize-autoloader
```

Buat `.env` production (isi sesuai environment server — lihat contoh struktur di `.env.example` pada root repo). Poin yang **wajib beda** dari environment lokal:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://namadomainkamu.com

DB_DATABASE=posave
DB_USERNAME=posave_user
DB_PASSWORD=(password yang dibuat di step 2)

REVERB_HOST="namadomainkamu.com"
REVERB_PORT=443
REVERB_SCHEME=https
```

> `REVERB_PORT` & `REVERB_SCHEME` ini krusial — kalau salah, browser akan gagal connect WebSocket karena mismatch HTTP vs HTTPS (mixed content). Lihat bagian [Reverb di Belakang Nginx](#5-konfigurasi-nginx) di bawah untuk penjelasan lengkap.

Lanjutkan setup:

```bash
php artisan key:generate
composer install --no-dev --optimize-autoloader
npm install
npm run build
php artisan migrate --force
php artisan storage:link

sudo chown -R $USER:www-data /var/www/posave
sudo chmod -R 775 storage bootstrap/cache
```

> Kalau butuh seeding data demo di production, jalankan `composer install` (tanpa `--no-dev`) dulu supaya Faker tersedia, baru `php artisan db:seed`, lalu kembalikan lagi ke `composer install --no-dev --optimize-autoloader` setelah selesai.

## 4. Setup Supervisor (Reverb & Queue Worker)

Reverb (WebSocket server) dan queue worker harus jalan sebagai proses background yang auto-restart. Buat 2 file config:

```bash
sudo nano /etc/supervisor/conf.d/posave-reverb.conf
```

```ini
[program:posave-reverb]
process_name=%(program_name)s
command=php /var/www/posave/artisan reverb:start
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/posave/storage/logs/reverb.log
```

```bash
sudo nano /etc/supervisor/conf.d/posave-worker.conf
```

```ini
[program:posave-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/posave/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/posave/storage/logs/worker.log
stopwaitsecs=3600
```

Aktifkan:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status
```

Pastikan `posave-reverb` dan `posave-worker:posave-worker_00` statusnya **RUNNING**.

## 5. Konfigurasi Nginx

Reverb berjalan secara internal di `127.0.0.1:8080`. Supaya browser bisa connect WebSocket lewat domain yang sama (via `wss://`, satu port dengan web `https://`, tanpa perlu buka port tambahan), Nginx perlu di-setting sebagai reverse proxy untuk path `/app/` dan `/apps/` yang dipakai Reverb:

```bash
sudo nano /etc/nginx/sites-available/posave
```

```nginx
server {
    listen 80;
    server_name namadomainkamu.com www.namadomainkamu.com;
    root /var/www/posave/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    index index.php;
    charset utf-8;

    location /app/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    location /apps/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }
    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    client_max_body_size 20M;
}
```

Aktifkan site & matikan default:

```bash
sudo ln -s /etc/nginx/sites-available/posave /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Pasang SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d namadomainkamu.com -d www.namadomainkamu.com
```

Ikuti prompt interaktifnya (isi email, setuju ToS, pilih opsi **redirect HTTP → HTTPS**). Certbot otomatis menambahkan blok SSL ke config Nginx dan setup renewal otomatis (sertifikat gratis berlaku 90 hari, diperpanjang otomatis lewat cron).

Setelah SSL aktif, **pastikan** `REVERB_PORT=443` dan `REVERB_SCHEME=https` di `.env` (lihat step 3), lalu:

```bash
npm run build
php artisan optimize:clear
sudo systemctl restart php8.3-fpm
sudo supervisorctl restart posave-reverb
sudo supervisorctl restart posave-worker:*
```

> **Kenapa perlu `npm run build` ulang:** Vite meng-embed nilai environment variable (`VITE_REVERB_*`) langsung ke dalam file JS hasil compile pada saat build — bukan dibaca ulang tiap kali halaman dibuka. Jadi perubahan `.env` gak akan berefek ke frontend sampai di-build ulang.

## 7. Konfigurasi Google OAuth (kalau pakai login Google)

Di [Google Cloud Console](https://console.cloud.google.com/apis/credentials), tambahkan ke **Authorized redirect URIs**:

```
https://namadomainkamu.com/auth/google/callback
https://www.namadomainkamu.com/auth/google/callback
```

`GOOGLE_REDIRECT_URI` di `.env` production mengikuti `APP_URL` — pastikan `APP_URL` sudah `https://` (bukan `http://`), kalau tidak akan muncul error `redirect_uri_mismatch` meski URI sudah terdaftar (karena http dan https dianggap redirect URI yang berbeda oleh Google).

## Update / Redeploy

Alur standar tiap ada perubahan kode baru:

```bash
cd /var/www/posave
git pull
composer install --no-dev --optimize-autoloader
npm install
npm run build
php artisan optimize:clear
```

Tambahkan ini **hanya kalau** ada perubahan pada kode PHP (controller, model, dsb):

```bash
sudo systemctl restart php8.3-fpm
```

Tambahkan ini **hanya kalau** ada perubahan pada Event broadcasting / queue job:

```bash
sudo supervisorctl restart posave-reverb
sudo supervisorctl restart posave-worker:*
```

## Troubleshooting

| Masalah                                                           | Penyebab & Solusi                                                                                                                                                                                               |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WebSocket gagal connect (`wss://...:8080` failed)                 | `REVERB_PORT`/`REVERB_SCHEME` di `.env` belum diubah ke `443`/`https` setelah SSL aktif, atau belum `npm run build` ulang setelahnya                                                                            |
| Error `Class ... does not comply with psr-4 autoloading standard` | Linux itu _case-sensitive_ untuk nama file/folder, beda dengan Windows/Mac. Samakan casing nama folder dengan namespace di kode (`namespace App\Exports` harus ada di folder `app/Exports`, bukan `app/Export`) |
| `Call to undefined function fake()` saat seeding                  | Jalankan `composer install` tanpa `--no-dev` dulu                                                                                                                                                               |
| Gambar upload tidak muncul                                        | Symlink `public/storage` belum dibuat — jalankan `php artisan storage:link`. Symlink ini tidak ikut ter-_commit_ ke Git (memang tidak boleh), jadi wajib dibuat ulang di tiap server baru                       |
| Modal form auto-close & pesan validasi tidak muncul               | Pastikan `resolve()` di `resources/js/app.tsx` tidak membuat instance komponen baru di setiap pemanggilan (harus di-cache per nama halaman), dan form submission menggunakan `preserveState: true`              |
| Upload gambar gagal (`413` atau silent fail)                      | `client_max_body_size` di Nginx dan/atau `upload_max_filesize`/`post_max_size` di `php.ini` masih default (terlalu kecil)                                                                                       |

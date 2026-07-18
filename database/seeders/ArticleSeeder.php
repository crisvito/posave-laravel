<?php

namespace Database\Seeders;

use App\Models\CompanyPage\Article;
use App\Models\CompanyPage\ArticleCategory;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
  public function run(): void
  {
    $categoryIds = ArticleCategory::pluck('id', 'slug');

    $articles = [
      [
        'category_slug' => 'tips-bisnis',
        'title' => 'Cara Mengelola Toko Kecil Agar Lebih Efisien',
        'title_en' => 'How to Run a Small Store More Efficiently',
        'excerpt' => 'Tips praktis untuk membantu toko kecil Anda lebih efisien dalam operasional sehari-hari dan meningkatkan penjualan.',
        'excerpt_en' => 'Practical tips to help your small store run more efficiently day-to-day and boost sales.',
        'content' => 'Mengelola toko kecil sering terasa melelahkan karena banyak hal harus dikerjakan sekaligus — dari melayani pembeli, mencatat transaksi, sampai memantau stok barang. Padahal, banyak dari proses ini bisa disederhanakan dengan bantuan teknologi kasir digital seperti POSAVE. Dengan mencatat transaksi secara otomatis dan memantau stok secara real-time, Anda tidak perlu lagi menghitung manual di buku atau mengecek gudang satu per satu. Waktu yang tadinya habis untuk pencatatan bisa dialihkan untuk hal yang lebih penting, seperti melayani pelanggan dan mengembangkan bisnis.',
        'content_en' => "Running a small store can feel exhausting because so many things need to happen at once — serving customers, recording transactions, and tracking stock. Fortunately, much of this can be simplified with digital POS technology like POSAVE. By automatically recording transactions and monitoring stock in real time, you no longer need to do manual bookkeeping or check the warehouse item by item. The time you used to spend on record-keeping can now go toward what matters more: serving customers and growing your business.",
        'image' => '/assets/blog/thumb-tips-bisnis-1.png',
        'read_time_minutes' => 5,
        'published_at' => '2026-04-25',
      ],
      [
        'category_slug' => 'manajemen-toko',
        'title' => 'Tips Mengatur Stok Barang untuk UMKM',
        'title_en' => 'Tips for Managing Stock for Small Businesses',
        'excerpt' => 'Pelajari cara mengatur stok barang agar tidak kehabisan atau menumpuk di gudang.',
        'excerpt_en' => 'Learn how to manage stock so it never runs out or piles up in the warehouse.',
        'content' => 'Mengelola stok barang seringkali menjadi tantangan terbesar bagi pelaku Usaha Mikro, Kecil, dan Menengah (UMKM). Stok yang terlalu sedikit membuat Anda kehabisan barang saat pembeli datang, sementara stok yang terlalu banyak membuat modal tertahan dan barang berisiko kadaluarsa atau rusak di gudang. Kuncinya adalah mencatat setiap pergerakan stok — masuk maupun keluar — secara konsisten, dan menetapkan batas stok minimum untuk tiap produk agar Anda mendapat peringatan sebelum barang benar-benar habis. Dengan sistem pencatatan yang rapi, Anda bisa membuat keputusan pembelian yang lebih tepat berdasarkan data, bukan sekadar perkiraan.',
        'content_en' => 'Managing stock is often the biggest challenge for small and medium businesses. Too little stock means running out when customers come, while too much stock ties up capital and risks spoilage or damage in the warehouse. The key is consistently recording every stock movement — both in and out — and setting a minimum stock threshold for each product so you get a warning before it actually runs out. With a tidy record-keeping system, you can make purchasing decisions based on real data instead of guesswork.',
        'image' => '/assets/blog/thumb-stok-barang-1.png',
        'read_time_minutes' => 4,
        'published_at' => '2026-04-21',
      ],
      [
        'category_slug' => 'tips-bisnis',
        'title' => 'Cara Meningkatkan Penjualan di Toko Kecil',
        'title_en' => 'How to Increase Sales at a Small Store',
        'excerpt' => 'Strategi sederhana yang bisa Anda terapkan untuk meningkatkan penjualan setiap hari.',
        'excerpt_en' => 'Simple strategies you can apply to increase sales every day.',
        'content' => 'Strategi sederhana yang bisa Anda terapkan untuk meningkatkan penjualan di toko Anda secara instan tanpa biaya marketing mahal, seperti menata ulang tata letak produk supaya barang paling laris mudah terlihat, memberikan promo kecil untuk pembelian dalam jumlah tertentu, dan menjaga hubungan baik dengan pelanggan tetap. Selain itu, memahami produk mana yang paling sering dibeli lewat laporan penjualan bisa membantu Anda fokus menstok barang yang benar-benar dibutuhkan pasar, sehingga modal tidak terbuang untuk barang yang kurang laku.',
        'content_en' => "Simple strategies you can apply to boost sales at your store instantly without expensive marketing, such as rearranging your product layout so best-sellers are easy to spot, offering small promotions for certain purchase amounts, and maintaining good relationships with regular customers. On top of that, understanding which products sell best through your sales reports helps you focus on stocking what the market actually needs, so your capital isn't wasted on slow-moving items.",
        'image' => '/assets/blog/thumb-tips-bisnis-2.png',
        'read_time_minutes' => 6,
        'published_at' => '2026-04-14',
      ],
      [
        'category_slug' => 'keuangan',
        'title' => 'Pentingnya Laporan Keuangan untuk Bisnis',
        'title_en' => 'The Importance of Financial Reports for Business',
        'excerpt' => 'Kenali manfaat laporan keuangan dan bagaimana data dapat membantu pengambilan keputusan.',
        'excerpt_en' => 'Learn the benefits of financial reports and how data can support better decision-making.',
        'content' => 'Kenali manfaat laporan keuangan dan bagaimana data dapat membantu Anda mengambil keputusan bisnis yang lebih menguntungkan. Laporan keuangan yang rapi menunjukkan dengan jelas berapa pemasukan, pengeluaran, dan keuntungan bersih toko Anda dalam periode tertentu — bukan sekadar perkiraan di kepala. Dengan data ini, Anda bisa melihat produk mana yang paling menguntungkan, kapan penjualan sedang ramai atau sepi, dan apakah bisnis Anda benar-benar bertumbuh dari waktu ke waktu. Ini juga memudahkan Anda saat butuh mengajukan pinjaman modal atau menjelaskan kondisi usaha ke calon investor.',
        'content_en' => "Learn the benefits of financial reports and how data can help you make more profitable business decisions. A well-organized financial report clearly shows your income, expenses, and net profit over a given period — not just a rough guess in your head. With this data, you can see which products are most profitable, when sales are high or low, and whether your business is truly growing over time. It also makes things easier when you need to apply for a business loan or explain your company's condition to potential investors.",
        'image' => '/assets/blog/thumb-keuangan-1.png',
        'read_time_minutes' => 5,
        'published_at' => '2026-04-09',
      ],
      [
        'category_slug' => 'teknologi',
        'title' => 'Kenapa POS Berbasis Cloud Lebih Menguntungkan',
        'title_en' => 'Why a Cloud-Based POS Is More Profitable',
        'excerpt' => 'Temukan keuntungan menggunakan sistem POS cloud untuk bisnis modern.',
        'excerpt_en' => 'Discover the advantages of using a cloud POS system for a modern business.',
        'content' => 'Temukan keuntungan menggunakan sistem POS cloud untuk bisnis modern agar bisa dipantau dari mana saja dan kapan saja. Berbeda dengan sistem kasir konvensional yang datanya tersimpan di satu perangkat saja, POS berbasis cloud menyimpan data transaksi dan stok secara online, sehingga Anda tetap bisa memantau toko meski sedang tidak berada di lokasi. Selain itu, data yang tersimpan di cloud lebih aman dari risiko kehilangan akibat perangkat rusak atau hilang, dan bisa diakses dari beberapa cabang sekaligus dalam satu dashboard yang sama.',
        'content_en' => "Discover the advantages of using a cloud POS system for a modern business so you can monitor it from anywhere, anytime. Unlike conventional POS systems where data is stored on a single device, a cloud-based POS stores transaction and stock data online, so you can keep an eye on your store even when you're not physically there. On top of that, data stored in the cloud is safer from loss due to a damaged or misplaced device, and can be accessed from multiple branches at once through the same dashboard.",
        'image' => '/assets/blog/thumb-teknologi-1.png',
        'read_time_minutes' => 4,
        'published_at' => '2026-04-07',
      ],
    ];

    foreach ($articles as $article) {
      Article::updateOrCreate(
        ['title' => $article['title']],
        [
          'article_category_id' => $categoryIds[$article['category_slug']],
          'title_en' => $article['title_en'],
          'excerpt' => $article['excerpt'],
          'excerpt_en' => $article['excerpt_en'],
          'content' => $article['content'],
          'content_en' => $article['content_en'],
          'image' => $article['image'],
          'read_time_minutes' => $article['read_time_minutes'],
          'published_at' => $article['published_at'],
          'is_active' => true,
        ],
      );
    }
  }
}

<?php

namespace Database\Seeders;

use App\Models\Advance\Messaging\Conversation;
use App\Models\Advance\Management\Employee\Employee;
use App\Models\Advance\Management\Inventory\Adjustment;
use App\Models\Advance\Management\Inventory\BranchStock;
use App\Models\Advance\Management\Inventory\Category;
use App\Models\Advance\Management\Inventory\Item;
use App\Models\Advance\Transaction\Transaction;
use App\Models\Advance\Transaction\TransactionItem;
use App\Models\Auth\Branch;
use App\Models\Auth\Company;
use App\Models\Auth\CompanyProfile;
use App\Models\Auth\UserProfile;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    private const ADVANCE_OWNER_EMAIL = 'owner.advance@posave.test';
    private const LITE_OWNER_EMAIL = 'owner.lite@posave.test';
    private const PASSWORD = 'password';

    /** Palet sama kayak CategoryController::COLOR_PALETTE / frontend CATEGORY_COLOR_SWATCHES. */
    private const CATEGORY_COLOR_PALETTE = ['#3d8ab8', '#16a34a', '#e75f1a', '#9f6fd5', '#dc2626', '#0891b2', '#ca8a04', '#db2777'];

    /** @var array<int, array{0: string, 1: string}> */
    private array $credentialRows = [];

    /**
     * Bikin data demo lengkap dari nol: company Advance (2 cabang, semua role)
     * dan company Lite (1 cabang, owner merangkap kasir) — termasuk katalog,
     * stok per cabang, riwayat adjustment, dan riwayat transaksi 7 hari.
     *
     * Aman dijalankan berkali-kali: data non-transaksional pakai firstOrCreate
     * (gak duplikat), transaksi & adjustment di-reset tapi HANYA untuk
     * company yang dibuat seeder ini sendiri — company/data asli kamu
     * (hasil register manual) tidak akan tersentuh sama sekali.
     */
    public function run(): void
    {
        $this->resetDemoTransactions([self::ADVANCE_OWNER_EMAIL, self::LITE_OWNER_EMAIL]);

        $this->seedAdvanceCompany();
        $this->seedLiteCompany();

        $this->command?->info('Selesai! Semua akun demo pakai password: ' . self::PASSWORD);
        $this->command?->table(['Role', 'Email'], $this->credentialRows);
    }

    /** Hapus transaksi & adjustment lama, TAPI hanya milik company yang seeder ini kelola. */
    private function resetDemoTransactions(array $ownerEmails): void
    {
        $ownerIds = User::whereIn('email', $ownerEmails)->pluck('id');
        $companyIds = Company::whereIn('owner_id', $ownerIds)->pluck('id');
        $branchIds = Branch::whereIn('company_id', $companyIds)->pluck('id');

        $transactionIds = Transaction::whereIn('branch_id', $branchIds)->pluck('id');
        TransactionItem::whereIn('transaction_id', $transactionIds)->delete();
        Transaction::whereIn('id', $transactionIds)->delete();
        Adjustment::whereIn('branch_id', $branchIds)->delete();
    }

    // ─── Company Advance ────────────────────────────────────────────

    private function seedAdvanceCompany(): void
    {
        [$owner, $company, $branches] = $this->createOwnerWithCompany(
            type: 'advance',
            ownerName: 'Owner Advance Demo',
            ownerEmail: self::ADVANCE_OWNER_EMAIL,
            branchNames: ['Cabang Utama', 'Cabang Kedua'],
        );

        $this->credentialRows[] = ['Owner (Advance)', $owner->email];

        $cashiers = [];

        foreach ($branches as $branch) {
            $manager = $this->createEmployee(
                name: 'Manager ' . $branch->name,
                email: 'manager.' . Str::slug($branch->name) . '@posave.test',
                role: 'branch_manager',
                companyId: $company->id,
                branch: $branch,
            );
            $this->credentialRows[] = ["Branch Manager - {$branch->name}", $manager->email];

            foreach (['Andi', 'Bintang'] as $name) {
                $cashier = $this->createEmployee(
                    name: "Kasir {$name} - {$branch->name}",
                    email: Str::slug($name) . '.' . Str::slug($branch->name) . '@posave.test',
                    role: 'cashier',
                    companyId: $company->id,
                    branch: $branch,
                );
                $this->credentialRows[] = ["Cashier - {$branch->name}", $cashier->email];
                $cashiers[] = $cashier;
            }
        }

        $items = $this->seedCatalog($company->id);
        $this->seedBranchStocks($branches, $items);
        $this->seedAdjustments($branches, $items);
        $this->seedTransactions($branches, $cashiers, $items);
    }

    // ─── Company Lite ───────────────────────────────────────────────

    private function seedLiteCompany(): void
    {
        [$owner, $company, $branches] = $this->createOwnerWithCompany(
            type: 'lite',
            ownerName: 'Owner Lite Demo',
            ownerEmail: self::LITE_OWNER_EMAIL,
            branchNames: ['Warung Utama'],
        );

        $this->credentialRows[] = ['Owner (Lite - merangkap Kasir)', $owner->email];

        // Katalog lebih kecil buat Lite — 2 kategori aja, konsisten sama
        // gambaran "warung kecil" yang disebut di konteks project.
        $items = $this->seedCatalog($company->id, small: true);
        $this->seedBranchStocks($branches, $items);
        $this->seedAdjustments($branches, $items);
        $this->seedTransactions($branches, [$owner], $items);
    }

    // ─── Helper: bikin owner + company + branch, niruin alur onboarding ────

    /** @return array{0: User, 1: Company, 2: \Illuminate\Support\Collection<int, Branch>} */
    private function createOwnerWithCompany(string $type, string $ownerName, string $ownerEmail, array $branchNames): array
    {
        // User dibuat duluan (tanpa company_id) — soalnya Company butuh owner_id
        // yang valid, persis alur register asli (user dulu, company belakangan).
        $owner = User::firstOrCreate(
            ['email' => $ownerEmail],
            ['name' => $ownerName, 'password' => bcrypt(self::PASSWORD), 'role' => 'owner'],
        );

        $company = Company::firstOrCreate(
            ['owner_id' => $owner->id],
            ['type' => $type],
        );

        CompanyProfile::firstOrCreate(
            ['company_id' => $company->id],
            ['name' => $ownerName . "'s Store"],
        );

        $branches = collect();
        foreach ($branchNames as $i => $name) {
            $branches->push(Branch::firstOrCreate(
                ['company_id' => $company->id, 'name' => $name],
                ['is_main' => $i === 0, 'status' => 'open'],
            ));
        }

        $mainBranch = $branches->firstWhere('is_main', true) ?? $branches->first();

        $owner->update([
            'company_id' => $company->id,
            'branch_id' => $mainBranch->id,
        ]);

        UserProfile::firstOrCreate(['user_id' => $owner->id]);

        return [$owner, $company, $branches];
    }

    /** Bikin 1 karyawan lengkap: User + UserProfile + Employee + join group chat cabang. */
    private function createEmployee(string $name, string $email, string $role, int $companyId, Branch $branch): User
    {
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => bcrypt(self::PASSWORD),
                'role' => $role,
                'company_id' => $companyId,
                'branch_id' => $branch->id,
            ],
        );

        UserProfile::firstOrCreate(['user_id' => $user->id]);

        Employee::firstOrCreate(
            ['user_id' => $user->id],
            [
                'company_id' => $companyId,
                'branch_id' => $branch->id,
                'name' => $name,
                'role' => $role,
                'active_date' => now(),
                'slot_status' => 'active',
            ],
        );

        $groupConversation = Conversation::firstOrCreate(
            ['branch_id' => $branch->id, 'type' => 'group'],
            ['company_id' => $companyId, 'name' => $branch->name],
        );

        if (! $groupConversation->members()->where('user_id', $user->id)->exists()) {
            $groupConversation->members()->attach($user->id, ['last_read_at' => now()]);
        }

        return $user;
    }

    // ─── Katalog, stok, adjustment, transaksi ───────────────────────

    private function seedCatalog(int $companyId, bool $small = false): array
    {
        $catalog = [
            'Minuman' => [
                'items' => [
                    ['Susu Ultra Milk 250ml', 6000, 4500],
                    ['Kopi Kapal Api Sachet', 2000, 1200],
                    ['Teh Pucuk Harum 350ml', 4000, 2800],
                    ['Aqua 600ml', 3500, 2500],
                    ['Pocari Sweat 500ml', 8000, 6000],
                    ['Le Minerale 600ml', 3500, 2400],
                ],
            ],
            'Makanan' => [
                'items' => [
                    ['Indomie Goreng', 3500, 2500],
                    ['Nasi Bungkus', 13000, 9000],
                    ['Roti Tawar Sari Roti', 16000, 12000],
                    ['Telur Ayam (butir)', 2500, 2000],
                    ['Sosis So Nice', 3000, 2100],
                ],
            ],
            'Snack' => [
                'items' => [
                    ['Chitato Sapi Panggang', 9500, 6800],
                    ['Taro Net', 6000, 4000],
                    ['Beng Beng', 2000, 1300],
                    ['Oreo Original', 8500, 5800],
                    ['SilverQueen 30gr', 11000, 8000],
                ],
            ],
            'Lainnya' => [
                'items' => [
                    ['Sabun Lifebuoy', 4000, 2800],
                    ['Tisu Paseo', 12000, 9000],
                    ['Baterai ABC AA', 10000, 7000],
                    ['Korek Api Gas', 3000, 1800],
                ],
            ],
        ];

        if ($small) {
            $catalog = array_intersect_key($catalog, array_flip(['Minuman', 'Makanan']));
        }

        $items = [];
        $colorIndex = 0;

        foreach ($catalog as $categoryName => $group) {
            // Rotasi warna dari palet yang sama kayak auto-assign di CategoryController::store(),
            // biar data demo gak keliatan abu-abu semua kayak sebelumnya.
            $color = self::CATEGORY_COLOR_PALETTE[$colorIndex % count(self::CATEGORY_COLOR_PALETTE)];
            $colorIndex++;

            $category = Category::firstOrCreate(
                ['company_id' => $companyId, 'name' => $categoryName],
                ['color' => $color],
            );

            foreach ($group['items'] as $i => [$name, $price, $cost]) {
                $sku = strtoupper(Str::slug($categoryName, '')) . '-' . str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT);

                $items[] = Item::firstOrCreate(
                    ['company_id' => $companyId, 'sku' => $sku],
                    ['category_id' => $category->id, 'name' => $name, 'price' => $price, 'cost' => $cost],
                );
            }
        }

        return $items;
    }

    private function seedBranchStocks($branches, array $items): void
    {
        foreach ($branches as $branch) {
            foreach ($items as $item) {
                BranchStock::firstOrCreate(
                    ['branch_id' => $branch->id, 'inventory_item_id' => $item->id],
                    ['current_stock' => random_int(10, 100), 'min_stock' => random_int(5, 15)],
                );
            }
        }
    }

    /** Beberapa riwayat koreksi stok manual (rusak, opname, retur), sekaligus update stok terkini. */
    private function seedAdjustments($branches, array $items): void
    {
        $reasons = [
            ['note' => 'Barang rusak', 'sign' => -1],
            ['note' => 'Kadaluarsa', 'sign' => -1],
            ['note' => 'Retur ke supplier', 'sign' => -1],
            ['note' => 'Stok fisik lebih (opname)', 'sign' => 1],
            ['note' => 'Penyesuaian setelah stok opname', 'sign' => 1],
        ];

        foreach ($branches as $branch) {
            $picked = collect($items)->random(min(3, count($items)));

            foreach ($picked as $item) {
                $reason = collect($reasons)->random();
                $qtyChange = $reason['sign'] * random_int(1, 5);

                Adjustment::create([
                    'inventory_item_id' => $item->id,
                    'branch_id' => $branch->id,
                    'note' => $reason['note'],
                    'qty_change' => $qtyChange,
                    'financial_change' => $qtyChange * (float) $item->cost,
                    'date' => now()->subDays(random_int(0, 6))->toDateString(),
                ]);

                $stock = BranchStock::where('branch_id', $branch->id)
                    ->where('inventory_item_id', $item->id)
                    ->first();

                if ($stock) {
                    $stock->update(['current_stock' => max(0, $stock->current_stock + $qtyChange)]);
                }
            }
        }
    }

    /** Riwayat transaksi 7 hari terakhir per cabang. */
    private function seedTransactions($branches, array $cashiers, array $items, int $days = 7): void
    {
        $start = Carbon::today()->subDays($days - 1);
        $end = Carbon::today();
        $itemRows = [];

        foreach ($branches as $branch) {
            $branchCashiers = array_values(array_filter($cashiers, fn($c) => $c->branch_id === $branch->id));
            $cashierPool = $branchCashiers !== [] ? $branchCashiers : $cashiers;

            for ($day = $start->copy(); $day->lte($end); $day->addDay()) {
                $isWeekend = $day->isWeekend();
                $count = random_int($isWeekend ? 10 : 5, $isWeekend ? 22 : 14);

                for ($t = 0; $t < $count; $t++) {
                    $lineCount = random_int(1, 5);
                    $picked = collect($items)->random(min($lineCount, count($items)));

                    $gross = 0.0;
                    $discount = 0.0;
                    $cogs = 0.0;
                    $pendingItems = [];

                    foreach ($picked as $item) {
                        $qty = random_int(1, 5);
                        $unitPrice = (float) $item->price;
                        $unitCost = (float) $item->cost;
                        $lineGross = $qty * $unitPrice;

                        $lineDiscount = random_int(1, 100) <= 20
                            ? round($lineGross * (random_int(5, 15) / 100), -2)
                            : 0.0;

                        $gross += $lineGross;
                        $discount += $lineDiscount;
                        $cogs += $qty * $unitCost;

                        $pendingItems[] = [
                            'item_id' => $item->id,
                            'product_name' => $item->name,
                            'category_name' => $item->category->name,
                            'qty' => $qty,
                            'unit_price' => $unitPrice,
                            'unit_cost' => $unitCost,
                            'discount_amount' => $lineDiscount,
                            'subtotal' => $lineGross - $lineDiscount,
                        ];
                    }

                    $isRefunded = random_int(1, 100) <= 5;
                    $refund = $isRefunded ? round(($gross - $discount) * (random_int(20, 100) / 100), -2) : 0.0;

                    $nett = $gross - $discount - $refund;
                    $rounded = round($nett / 500) * 500;
                    $rounding = $rounded - $nett;

                    $transactedAt = $day->copy()->setTime(random_int(8, 20), random_int(0, 59), random_int(0, 59));

                    // Placeholder dulu — invoice asli diisi setelah tau `id`-nya,
                    // sama persis polanya kayak checkout asli di OrderController.
                    // Ini yang bikin dijamin unik lintas company/cabang, tanpa
                    // perlu hitung manual yang rawan bentrok.
                    $transaction = Transaction::create([
                        'branch_id' => $branch->id,
                        'user_id' => collect($cashierPool)->random()->id,
                        'invoice_no' => 'PENDING-' . uniqid(),
                        'status' => $isRefunded ? 'refunded' : 'completed',
                        'payment_method' => $this->randomPaymentMethod(),
                        'gross_amount' => $gross,
                        'discount_amount' => $discount,
                        'refund_amount' => $refund,
                        'tax_amount' => 0,
                        'gratuity_amount' => 0,
                        'rounding_amount' => $rounding,
                        'cogs_amount' => $cogs,
                        'total_amount' => $rounded,
                        'transacted_at' => $transactedAt,
                    ]);

                    $transaction->update([
                        'invoice_no' => sprintf('INV/%s/%05d', $day->format('Ymd'), $transaction->id),
                    ]);

                    foreach ($pendingItems as $row) {
                        $row['transaction_id'] = $transaction->id;
                        $row['created_at'] = $transactedAt;
                        $row['updated_at'] = $transactedAt;
                        $itemRows[] = $row;
                    }

                    if (count($itemRows) >= 500) {
                        TransactionItem::insert($itemRows);
                        $itemRows = [];
                    }
                }
            }
        }

        if ($itemRows !== []) {
            TransactionItem::insert($itemRows);
        }
    }

    private function randomPaymentMethod(): string
    {
        $roll = random_int(1, 100);

        return match (true) {
            $roll <= 50 => 'cash',
            $roll <= 80 => 'qris',
            $roll <= 92 => 'debit',
            default => 'transfer',
        };
    }
}

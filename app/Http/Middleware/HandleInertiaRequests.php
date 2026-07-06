<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Foundation\Inspiring;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Ambil quote inspirasi bawaan laravel starter kit
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Ambil bahasa yang sedang aktif saat ini
        $locale = app()->getLocale();

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            // Tambahkan ini untuk sinkronisasi bahasa ke React
            'locale' => $locale,
            'translations' => function () use ($locale) {
                // Tulis file bahasa apa saja yang ingin kamu muat secara aman & statis
                $filesToLoad = ['company-profile/faq', 'company-profile/welcome', 'company-profile/blog', 'company-profile/inquiry', 'company-profile/services']; 
                $translations = [];

                foreach ($filesToLoad as $file) {
                    $path = lang_path($locale . '/' . $file . '.php');
                    if (file_exists($path)) {
                        $translations[$file] = include($path);
                    }
                }
                return $translations;
            },
        ]);
    }
}
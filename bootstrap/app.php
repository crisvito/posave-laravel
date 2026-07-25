<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        channels: __DIR__ . '/../routes/channels.php',
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'onboarded' => \App\Http\Middleware\EnsureOnboarded::class,
            'role'      => \App\Http\Middleware\EnsureRole::class,
            'advance'   => \App\Http\Middleware\EnsureAdvanceMode::class,
            'lite'      => \App\Http\Middleware\EnsureLiteMode::class,
            'cashier-access' => \App\Http\Middleware\EnsureCashierAccess::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            if (app()->environment(['local', 'testing']) && in_array($response->getStatusCode(), [403, 404, 500, 503])) {
                return Inertia::render('error/error', ['status' => $response->getStatusCode()])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            }

            if ($response->getStatusCode() === 419) {
                return back()->with(['message' => 'Sesi kamu udah kadaluarsa, coba lagi.']);
            }

            return $response;
        });
    })->create();

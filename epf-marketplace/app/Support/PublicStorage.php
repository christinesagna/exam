<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

final class PublicStorage
{
    public static function url(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        $path = str_replace('\\', '/', trim($path));
        $path = preg_replace('#^/?(?:public/|storage/)#i', '', $path);

        if ($path === '' || ! Storage::disk('public')->exists($path)) {
            return null;
        }

        return url('/storage/'.$path);
    }
}

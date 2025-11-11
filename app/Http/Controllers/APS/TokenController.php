<?php

namespace App\Http\Controllers\APS;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class TokenController
{
    public function __invoke()
    {
        // Cache del token por 25 min (el token dura 30 min)
        $token = Cache::remember('aps_token', 1500, function () {
            $response = Http::withOptions(['verify' => false])
                ->asForm()
                ->post(config('services.aps.base_url') . '/authentication/v2/token', [
                    'grant_type' => 'client_credentials',
                    'client_id' => config('services.aps.client_id'),
                    'client_secret' => config('services.aps.client_secret'),
                    'scope' => 'data:read data:write bucket:read'
                ]);

            return $response->json();
        });

        return response()->json([
            "access_token" => $token["access_token"],
            "expires_in" => $token["expires_in"],
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use HardImpact\Waymaker\Get;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    #[Get(uri: '/')]
    public function show(): \Inertia\ResponseFactory|\Inertia\Response
    {
        return inertia('Home');
    }

    #[Get(uri: 'test123')]
    public function test123(): JsonResponse
    {
        return response()->json([
            'message' => 'Hello World',
        ]);
    }
}

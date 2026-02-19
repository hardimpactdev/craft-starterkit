<?php

declare(strict_types=1);

use App\Models\User;

it('can visit the home page', function () {
    $page = visit('/');

    $page->assertOk();
});

it('can sign in a user', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $page = visit('/login')
        ->assertSee('Sign In')
        ->type('email', 'test@example.com')
        ->type('password', 'password')
        ->press('Sign In');

    $page->assertPathIs('/dashboard');
    $this->assertAuthenticated();
});

it('validates accessibility on the home page', function () {
    $page = visit('/');

    $page->assertNoAccessibilityIssues();
});

it('has no JavaScript errors on the home page', function () {
    $page = visit('/');

    $page->assertNoJavaScriptErrors();
});

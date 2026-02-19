# Tests Directory

Pest PHP tests.

## Requirements

- Every feature MUST have tests
- Use Pest syntax (not PHPUnit classes)
- Use `describe()` and `it()` for structure
- Test happy paths and edge cases
- Run with `php artisan test`

## Browser Testing

This project uses **Pest Browser Testing** (not Playwright directly) for E2E tests.

### Why Pest Browser?

- **Native Laravel integration** - Use factories, auth assertions, event faking
- **Same test database** - Browser tests share DB with feature tests
- **Single language** - All tests in PHP
- **Built-in accessibility testing** - `assertNoAccessibilityIssues()`

### Running Browser Tests

```bash
# Run all tests including browser tests
./vendor/bin/pest

# Run in parallel (recommended)
./vendor/bin/pest --parallel

# Run with visible browser (debug mode)
./vendor/bin/pest --debug

# Run in headed mode
./vendor/bin/pest --headed
```

### Writing Browser Tests

```php
<?php

declare(strict_types=1);

use App\Models\User;

it('can sign in a user', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $page = visit('/login')
        ->assertSee('Sign In')
        ->type('email', 'test@example.com')
        ->type('password', 'password')
        ->press('Sign In')
        ->assertPathIs('/dashboard');

    $this->assertAuthenticated();
});
```

### Directory Structure

```
tests/
├── Browser/          # Browser/E2E tests (Pest Browser)
│   └── HomeTest.php
├── Feature/          # Feature tests (HTTP, controllers)
└── Unit/             # Unit tests
```

### Key Features

- Use Laravel factories in browser tests
- Event faking works natively
- Auth assertions (`assertAuthenticated()`)
- Built-in accessibility checks
- Screenshot testing support
- Mobile/responsive testing

See [Pest Browser Testing docs](https://pestphp.com/docs/browser-testing) for full API reference.

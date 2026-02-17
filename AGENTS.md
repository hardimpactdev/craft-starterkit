# AI Agent Development Guide

This file provides essential information for AI coding agents working in this repository.

## Hierarchical Context Files

This project uses hierarchical CLAUDE.md files for domain-specific guidance:

```
AGENTS.md (this file)         # Project overview (symlinked to CLAUDE.md)
app/CLAUDE.md                 # Backend rules overview
  Actions/CLAUDE.md           # Action pattern
  Data/CLAUDE.md              # DTOs
  Enums/CLAUDE.md             # Enums
  Http/Controllers/CLAUDE.md  # Controllers
  Http/Middleware/CLAUDE.md   # Middleware
  Http/Requests/CLAUDE.md     # Form requests
  Models/CLAUDE.md            # Eloquent models
resources/CLAUDE.md           # Frontend rules (Vue, Inertia)
tests/CLAUDE.md               # Testing rules
```

## Quick Reference: Commands

### Development

```bash
composer dev              # Start all services (server, queue, pail, vite)
npm run dev               # Start Vite dev server only
php artisan serve         # Start Laravel dev server only
```

### Testing

```bash
php artisan test                                    # Run all tests
composer test                                       # Run tests in parallel
vendor/bin/pest tests/Feature/RoutesTest.php       # Run single file
vendor/bin/pest --filter="test name"               # Run by test name
vendor/bin/pest tests/Feature/ExampleTest.php:15   # Run by line number
npm run test:e2e                                   # Run Playwright E2E tests
```

### Code Quality

```bash
composer lint             # Format PHP with Pint
composer analyse          # PHPStan static analysis (level 9)
composer check            # Run tests + analyse
composer rector           # Run Rector upgrades
npm run format            # Format frontend with Prettier
npm run format:check      # Check formatting
npm run oxlint            # Lint JS/TS with oxlint
```

### Build & Generate

```bash
npm run build                        # Build frontend assets
php artisan waymaker:generate        # Generate routes from controller attributes
```

## Technology Stack

| Layer           | Technology                          |
| --------------- | ----------------------------------- |
| Backend         | PHP 8.4, Laravel 12                 |
| Frontend        | Vue 3 (Composition API), TypeScript |
| SPA Bridge      | Inertia.js v2                       |
| Styling         | Tailwind CSS v4                     |
| Testing         | Pest v3, Playwright                 |
| Routing         | Waymaker (attribute-based)          |
| DTOs            | spatie/laravel-data                 |
| Static Analysis | PHPStan level 9 + Larastan          |
| Code Style      | Laravel Pint, Prettier              |

## Code Style Guidelines

### PHP Conventions

**File headers** - Always include strict types:

```php
<?php

declare(strict_types=1);

namespace App\Feature;
```

**Class modifiers**:

- Actions: `final readonly class` with single `handle()` method
- Models: `final class` with factories and seeders
- Controllers: Standard class, resourceful methods only

**Naming conventions**:

- Controllers: `{Resource}Controller` suffix
- Requests: `{Action}{Resource}Request` suffix (e.g., `StoreUserRequest`)
- Commands: `{Action}Command` suffix
- Policies: `{Model}Policy` suffix
- No `Model` suffix on models

**Never do**:

- Edit `routes/web.php` manually (use Waymaker attributes)
- Inline validation in controllers (use FormRequest)
- Use `dd`, `ddd`, `dump`, `env`, `exit`, `ray` in production code
- Access `$request->validated()` directly (use `$request->getData()`)

### TypeScript/Vue Conventions

**Vue components** - Always use Composition API:

```vue
<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

interface Props {
    className?: HTMLAttributes['class'];
}

defineProps<Props>();
</script>

<template>
    <!-- content -->
</template>
```

**Imports** - Use path aliases:

```typescript
import { useForm } from '@inertiajs/vue3';
import { Controllers } from '@/controllers';
import type { User } from '@/types';
```

**Routing** - Never hardcode URLs:

```typescript
// Good
Controllers.UserController.store.url();

// Bad
('/users');
```

**Formatting** (from .oxfmtrc.json):

- Print width: 100
- Single quotes: true
- Tailwind class sorting enabled

### PHP Formatting (Laravel Pint)

Uses `laravel` preset. Key rules enforced:

- 4 spaces indentation
- PSR-12 compliance
- Strict types declaration

## Architecture Rules

### Directory Structure

```
app/
  Actions/{Feature}/     # Business logic (final readonly)
  Data/                  # DTOs (spatie/laravel-data)
  Enums/                 # PHP 8 backed enums
  Http/Controllers/      # Waymaker-attributed controllers
  Http/Middleware/       # HTTP middleware (must have handle())
  Http/Requests/         # Form requests with getData()
  Models/                # Eloquent models (final)
resources/js/
  components/            # Reusable Vue components
  controllers/           # Auto-generated route helpers
  pages/                 # Inertia page components
  types/                 # TypeScript definitions
tests/
  Feature/               # Feature tests
  Unit/                  # Unit tests
  e2e/                   # Playwright tests
```

### Controller Pattern

```php
class UserController extends Controller
{
    #[Get(uri: '/users')]
    public function index(): Response { }

    #[Post(uri: '/users')]
    public function store(StoreUserRequest $request, CreateUser $action): RedirectResponse
    {
        $user = $action->handle($request->getData());
        return redirect()->route('users.show', $user);
    }
}
```

Only resourceful methods: `index`, `show`, `create`, `store`, `edit`, `update`, `destroy`

### Action Pattern

```php
final readonly class CreateUser
{
    public function __construct(private UserService $service) {}

    public function handle(UserData $data): User
    {
        return $this->service->create($data);
    }
}
```

### FormRequest Pattern

```php
class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return ['name' => 'required|string', 'email' => 'required|email'];
    }

    public function getData(): UserData
    {
        return UserData::from($this->validated());
    }
}
```

## Testing Patterns

Use Pest syntax with `describe()` and `it()`:

```php
describe('UserController', function () {
    it('lists all users', function () {
        $users = User::factory()->count(3)->create();

        $response = $this->get('/users');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('users', 3));
    });
});
```

Architecture tests in `tests/Feature/ArchitectureTest.php` enforce:

- Models extend Eloquent Model
- FormRequests have `Request` suffix
- Commands have `Command` suffix and `handle()` method
- No debug functions in production code

## Frontend Patterns

### Form Handling

```typescript
const form = useForm({
    name: '',
    email: '',
});

function submit() {
    form.post(Controllers.UserController.store.url());
}
```

### API Calls (JSON)

```typescript
import axios from 'axios';

const { data } = await axios.post(Controllers.ApiController.action.url());
```

### Layout

Always use `AppLayout` - never create custom layouts.

### Components

Check `@hardimpactdev/craft-ui` before creating custom components.

## Important Reminders

1. Run `php artisan waymaker:generate` after controller changes
2. Every feature MUST include Pest tests
3. Check existing patterns in sibling files before creating new ones
4. Use the hierarchical CLAUDE.md files for domain-specific guidance
5. PHPStan runs at level 9 - all types must be explicit

## Project Conventions

### Mass Assignment (Model::unguard)

This project uses `Model::unguard()` in `AppServiceProvider` to disable Laravel's mass assignment protection globally. This is an **intentional design choice** for this starter kit to reduce boilerplate. 

- Models do NOT need `$fillable` or `$guarded` properties
- Always validate input via Form Requests before mass assignment
- This is safe because: (1) All input is validated, (2) This is a starter kit intended for rapid development

**DO NOT flag this as a security issue in code reviews.**

### Testing Environment

**Never set `APP_ENV` in `phpunit.xml`** - it sets a process-level environment variable that can leak to other projects. Instead:

- Use `.env.testing` for all test environment configuration
- The `.env.testing` file is committed to git with safe defaults
- Each project should have its own isolated `.env.testing`

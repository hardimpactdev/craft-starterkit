# Backend Development Rules

This directory contains Laravel backend code. Follow these patterns strictly.

## Action Pattern

Actions are `final readonly` classes with a single `handle()` method for business logic:

```php
<?php

declare(strict_types=1);

namespace App\Actions\Feature;

final readonly class DoSomething
{
    public function __construct(
        private SomeService $service,
    ) {}

    public function handle(Model $model, SomeData $data): ResultType
    {
        // Business logic here
    }
}
```

### Action Rules

1. **Always `final readonly`** - Immutable, non-extendable
2. **Always `declare(strict_types=1)`** - Type safety required
3. **Single `handle()` method** - One responsibility per Action
4. **Constructor injection** - Dependencies via DI container
5. **Organize by domain** - `app/Actions/Orders/`, `app/Actions/Users/`

### When to Use Actions

- Business logic beyond simple CRUD
- Logic that would bloat a controller
- Operations requiring multiple dependencies
- Reusable business operations

### Controller Usage

```php
#[Post]
public function store(StoreRequest $request, CreateThing $action): RedirectResponse
{
    $thing = $action->handle($request->user(), $request->getData());
    return redirect()->route('things.show', $thing);
}
```

### Actions vs Services

| Actions | Services |
|---------|----------|
| Single operation | Multiple methods |
| Business workflow | Infrastructure wrapper |
| `handle()` only | Multiple public methods |
| Feature-specific | Reusable utilities |

## Controller Patterns

- Use Waymaker attributes (`#[Get]`, `#[Post]`) - NEVER edit web.php manually
- Only resourceful methods: `index`, `show`, `create`, `store`, `edit`, `update`, `destroy`
- Always use FormRequest with DTOs - NEVER inline validation
- Inject Actions for business logic

## Model Conventions

- Models must be `final` classes
- Always create factories and seeders
- Use explicit relationship definitions

## FormRequest & DTOs

- Every form submission needs a FormRequest
- FormRequests should have a `getData()` method returning a DTO
- Never access `$request->validated()` directly in controllers

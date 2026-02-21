# Listener Conventions

## Organization
- Group by domain: `Listeners/Chat/`, `Listeners/Billing/`
- Name after what they do: `SendWelcomeEmail`, `UpdateSearchIndex`, `NotifyAdmins`
- One listener per side effect — don't bundle multiple actions in one listener

## Structure

```php
final class SendWelcomeEmail implements ShouldQueue
{
    public function handle(UserCreated $event): void
    {
        Mail::to($event->user->email)
            ->send(new WelcomeMail($event->user));
    }
}
```

## Queuing
- **Use `ShouldQueue`** for anything that takes time: emails, API calls, file processing, notifications
- Only keep listeners synchronous when the side effect must complete before the response (rare)
- Specify queue connection/name when different from default:

```php
public string $connection = 'redis';
public string $queue = 'notifications';
```

## Retry & Failure Handling
- Define `$tries` and `$backoff` for retryable operations
- Implement `failed()` method to handle permanent failures (log, notify)
- Use `$maxExceptions` to limit retries on specific exception types

```php
public int $tries = 3;
public array $backoff = [10, 60, 300]; // seconds

public function failed(UserCreated $event, Throwable $exception): void
{
    Log::error('Failed to send welcome email', [
        'user_id' => $event->user->id,
        'error' => $exception->getMessage(),
    ]);
}
```

## One Listener Per Side Effect
- Sending email? One listener.
- Updating cache? Another listener.
- Logging? Another listener.
- This keeps listeners testable, retryable, and independently deployable

## Registration
- Use Laravel's auto-discovery (default) — no manual registration needed
- Listeners are discovered in `app/Listeners/` automatically

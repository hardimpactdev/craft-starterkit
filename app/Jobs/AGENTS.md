# Job Conventions

## Structure

```php
final class ProcessPayment implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly PaymentData $payment,
    ) {}

    public function handle(PaymentGateway $gateway): void
    {
        $gateway->charge($this->payment);
    }
}
```

### Constructor
- Accept data via constructor (DTOs or model IDs)
- Use `readonly` properties
- Keep constructor light — no side effects

### handle() Method
- Type-hint dependencies for automatic injection
- Contains the job's actual work
- Single responsibility — one job, one task

## Queue Configuration

### Connection & Queue
- Specify connection/queue when different from default
- Use named queues for priority: `high`, `default`, `low`

```php
public function __construct(private readonly PaymentData $payment)
{
    $this->onQueue('high');
    $this->onConnection('redis');
}
```

### Retry & Backoff
- Define `$tries` for max attempts
- Use `$backoff` array for progressive delays
- Implement `failed()` for permanent failure handling

```php
public int $tries = 3;
public array $backoff = [30, 60, 300];

public function failed(Throwable $exception): void
{
    Log::error('Payment processing failed', [
        'payment_id' => $this->payment->id,
        'error' => $exception->getMessage(),
    ]);
}
```

## Broadcasting from Jobs

**Always use `broadcastNow()` / `sendNow()` inside queued jobs.** Regular `broadcast()` / `send()` queues a new job, which won't run until the current job finishes — defeating real-time streaming.

```php
// CORRECT — inside a queued job
broadcastNow(new StreamChunkReceived($chunk));

// WRONG — queues another job that waits
broadcast(new StreamChunkReceived($chunk));
```

## Idempotency

Jobs may be retried. Design them to be safe to run multiple times:
- Check if work was already done before doing it again
- Use database transactions with unique constraints
- Use `firstOrCreate()` / `updateOrCreate()` instead of blind `create()`

```php
public function handle(): void
{
    // Idempotent — safe to retry
    $receipt = Receipt::firstOrCreate(
        ['payment_id' => $this->payment->id],
        ['amount' => $this->payment->amount],
    );
}
```

## Dispatching
- Dispatch from Actions/Services, not Controllers
- Use `::dispatch()` for queued execution
- Use `::dispatchSync()` only when result is needed immediately (rare)

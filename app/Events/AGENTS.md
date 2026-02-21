# Event Conventions

## Naming
- Past tense: `UserCreated`, `OrderShipped`, `PaymentFailed`
- Domain-prefixed for clarity: `Chat\MessageSent`, `Billing\InvoicePaid`
- Never name as commands: ~~`CreateUser`~~ — that's an Action

## Payload Structure
- Use DTOs (spatie/laravel-data) for event payloads, not raw arrays
- Pass the minimum data needed — listeners can query for more
- Include the model ID at minimum, full model when listeners need it immediately

```php
final readonly class OrderShipped
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public OrderData $order,
    ) {}
}
```

## Broadcasting

### Channel Naming
- Private channels: `user.{userId}`, `team.{teamId}`
- Presence channels: `chat.{conversationId}`
- Use dot notation, not slashes
- Include the resource ID in the channel name

### Reverb Patterns
- Always define `broadcastOn()` returning channel instances
- Use `broadcastAs()` for custom event names (kebab-case)
- Use `broadcastWith()` to control payload shape (don't expose full models)

### broadcastNow() vs broadcast()
**Always use `broadcastNow()` when broadcasting from within a queued job.** The regular `broadcast()` queues the event as a separate job, which won't execute until the current job finishes — defeating real-time streaming.

```php
// Inside a queued job — ALWAYS use broadcastNow
broadcastNow(new MessageChunkReceived($chunk));

// In synchronous code (controller, action) — either works
broadcast(new OrderShipped($order));
```

## Dispatching
- Use `event()` helper or `Event::dispatch()` for internal events
- Use `broadcast()` / `broadcastNow()` for WebSocket events
- Dispatch from Actions/Services, not Controllers

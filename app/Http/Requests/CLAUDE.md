# Form Requests Directory

Validation and authorization for form submissions.

## Requirements

- Every form submission needs a FormRequest
- Implement `getData(): SomeData` method returning a DTO
- Never access `$request->validated()` directly in controllers
- Use `authorize()` for permission checks

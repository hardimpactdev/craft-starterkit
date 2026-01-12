# Project Development Guide

## Structure

This project uses hierarchical CLAUDE.md files for AI-assisted development:

```
CLAUDE.md                       # This file: project overview
.claude/mcp.json                # MCP server configuration
app/CLAUDE.md                   # Backend rules overview
├── Actions/CLAUDE.md           # Action pattern
├── Data/CLAUDE.md              # DTOs
├── Enums/CLAUDE.md             # Enums
├── Http/Controllers/CLAUDE.md  # Controllers
├── Http/Middleware/CLAUDE.md   # Middleware
├── Http/Requests/CLAUDE.md     # Form requests
├── Models/CLAUDE.md            # Eloquent models
resources/CLAUDE.md             # Frontend rules (Vue, Inertia)
tests/CLAUDE.md                 # Testing rules
```

Claude Code automatically loads context from CLAUDE.md files in directories you're working in.

## Technology Stack

- **PHP 8.4** with Laravel 12
- **Vue 3** with Composition API
- **Inertia.js v2** for SPA architecture
- **Tailwind CSS v4** for styling
- **TypeScript** for type safety
- **Pest v3** for testing
- **Waymaker** for automatic routing
- **Laravel Boost** MCP server for AI tools

## Key Development Principles

### Backend

- Use Waymaker attributes (`#[Get]`, `#[Post]`) - NEVER edit web.php
- Always use FormRequest with DTOs - NEVER inline validation
- Only resourceful controller methods (index, show, create, store, edit, update, destroy)
- Use Actions for business logic - `final readonly` classes with `handle()` method
- Models must be final classes with factories and seeders
- Every feature MUST include Pest tests

### Frontend

- Use AppLayout - don't create custom layouts
- Check liftoff-vue components before creating custom ones
- Don't manually import auto-imported components
- Use `Controllers.ControllerName.methodName()` - NEVER hardcode URLs
- Expect form props from backend DTOs

## Quick Commands

```bash
# After controller changes
php artisan waymaker:generate

# Static analysis
composer analyse

# Run tests
php artisan test

# Format code
vendor/bin/pint --dirty

# Build frontend
npm run build

# Development server
npm run dev
```

## MCP Tools

Laravel Boost MCP server provides AI assistance tools:

- `search-docs` - Search Laravel ecosystem documentation
- `application-info` - Get project context at start of chats
- `get-absolute-url` - Generate shareable project URLs
- `list-artisan-commands` - List available Artisan commands

## Important Reminders

- **Check existing components** before creating new ones
- **Follow existing patterns** in sibling files
- **Test thoroughly** before considering features complete
- **Never assume patterns** - check the codebase first
- **Don't fight the framework** - follow established conventions

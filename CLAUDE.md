# Project Development Guide

## AI Rule System
This project uses comprehensive AI-assisted development rules located in `.ai/rules/`. These rules ensure consistency, quality, and best practices across the codebase.

## Quick Start
1. **Always consult rules first**: Check `.ai/rules/Rules.mdc` for technology stack overview
2. **Follow appropriate category**: Backend → `.ai/rules/backend/`, Frontend → `.ai/rules/frontend/`
3. **Use development tools**: Laravel Boost, Herd → `.ai/rules/development/`

## Rule Structure

### Core Categories
- **Backend Rules** (`.ai/rules/backend/`)
  - General.mdc - PHP & Laravel conventions
  - Controllers.mdc - Controller patterns with Inertia
  - Routes.mdc - Waymaker routing (NO manual routes!)
  - FormRequests.mdc - Validation with DTOs
  - Models.mdc - Eloquent models and relationships
  - Database.mdc - Migrations and seeding
  - DTOs.mdc - Data Transfer Objects
  - Enums.mdc - Database value enums
  - Middleware.mdc - Middleware patterns
  - Testing.mdc - Pest test requirements

- **Frontend Rules** (`.ai/rules/frontend/`)
  - Vue.mdc - Vue 3 Composition API patterns
  - Inertia.mdc - Inertia.js v2 integration
  - TypeScript.mdc - TypeScript conventions
  - LiftoffUI.mdc - UI component library
  - Tailwind.mdc - Tailwind CSS v4 patterns
  - AutoImports.mdc - Auto-import configuration
  - Routing.mdc - Frontend routing with Controllers object
  - Forms.mdc - Form handling with DTOs

- **Development Tools** (`.ai/rules/development/`)
  - laravel-boost.mdc - MCP server tools & documentation search
  - herd.mdc - Local development server
  - pint.mdc - Code formatting

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

## Rule Management

### Hierarchy (highest to lowest priority)
1. Explicit user override in current session
2. Directory-specific CLAUDE.md files
3. Global rules in `.ai/rules/`
4. Framework conventions

### When Rules Conflict
- Identify the conflicting rule and location
- Ask for clarification before proceeding
- Update rule files with clear documentation if confirmed

### Adding New Rules
- Recognize patterns after 2-3 corrections
- Propose additions to appropriate rule file
- Place in most specific location possible

## Important Reminders
- **Check existing components** before creating new ones
- **Follow existing patterns** in sibling files
- **Test thoroughly** before considering features complete
- **Never assume patterns** - consult the rules
- **Don't fight the framework** - follow established conventions

## Tool Usage
- Use Laravel Boost `search-docs` for Laravel ecosystem documentation
- Use `application-info` tool at start of new chats
- Use `get-absolute-url` for sharing project URLs
- Check `list-artisan-commands` for available Artisan options

The rules exist to maintain code quality and consistency. Following them ensures smoother development and fewer conflicts.
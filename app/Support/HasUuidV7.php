<?php

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Trait for models using UUID v7 as primary key.
 *
 * UUID v7 is time-ordered, making it suitable for primary keys as it:
 * - Maintains chronological ordering for better index performance
 * - Is globally unique without coordination
 * - Includes timestamp information
 */
trait HasUuidV7
{
    /**
     * Initialize the trait.
     */
    public function initializeHasUuidV7(): void
    {
        $this->usesUniqueIds = true;
    }

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public function getIncrementing(): bool
    {
        return false;
    }

    /**
     * Get the type of the primary key.
     */
    public function getKeyType(): string
    {
        return 'string';
    }

    /**
     * Get the columns that should receive unique identifiers.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return [$this->getKeyName()];
    }

    /**
     * Generate a new UUID v7 for the model.
     */
    public function newUniqueId(): string
    {
        return (string) Str::uuid7();
    }
}

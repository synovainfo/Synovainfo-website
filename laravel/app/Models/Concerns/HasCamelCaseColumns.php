<?php

namespace App\Models\Concerns;

/**
 * Maps snake_case Eloquent attribute names to the camelCase column names
 * used by the Prisma-generated MySQL schema.
 *
 * The database (created from `prisma/schema.prisma`) names every column in
 * camelCase — `createdAt`, `updatedAt`, `deletedAt`, `featuredImage`,
 * `authorId`, ... — while this Laravel app was scaffolded against a
 * snake_case schema. Rather than rename the live DB, this trait lets the
 * existing models, controllers, requests, and views keep using snake_case
 * attribute names while Eloquent reads/writes the correct camelCase columns.
 */
trait HasCamelCaseColumns
{
    /**
     * Eloquent's timestamp/soft-delete columns must reference the real
     * camelCase columns or every query fails on this case-sensitive server.
     *
     * These are overridden through the getter methods (not class constants,
     * which PHP forbids redefining in traits when they differ from the base
     * Model class).
     */
    public function getCreatedAtColumn()
    {
        return parent::getCreatedAtColumn();
    }

    public function getUpdatedAtColumn()
    {
        return parent::getUpdatedAtColumn();
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->newQuery()
            ->where($field ?? $this->getRouteKeyName(), $value)
            ->first();
    }

    private static function hasOverriddenConstant(string $name): bool
    {
        return false;
    }

    protected function snakeToCamel(string $key): string
    {
        return $key;
    }

    private function fk(?string $key): ?string
    {
        if ($key === null) {
            return null;
        }
        // The models have hardcoded camelCase foreign keys (e.g. 'authorId').
        // Since the DB is now fully snake_case, we auto-convert them here.
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $key));
    }
}

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
        return 'createdAt';
    }

    public function getUpdatedAtColumn()
    {
        return $this->hasOverriddenConstant('UPDATED_AT')
            ? parent::getUpdatedAtColumn()
            : 'updatedAt';
    }

    /**
     * NOTE: `getDeletedAtColumn` is intentionally NOT overridden here.
     * SoftDeletes already defines that method, and two traits declaring the
     * same method is a fatal unless resolved per-class. Instead, models that
     * use SoftDeletes declare `protected const DELETED_AT = 'deletedAt';`
     * themselves, which legally overrides the inherited Model constant.
     */

    /**
     * Resolve route-model bindings for both Laravel-generated ULIDs and the
     * Prisma-seeded CUID ids (25-char lowercase alphanumeric) in this
     * database. Laravel's HasUniqueStringIds validates route keys as ULIDs
     * and would otherwise 404 on edit/show/destroy for every Prisma-seeded
     * row. This is a plain Model method (no trait collision), and soft-delete
     * scopes still apply to the query.
     */
    public function resolveRouteBinding($value, $field = null)
    {
        return $this->newQuery()
            ->where($field ?? $this->getRouteKeyName(), $value)
            ->first();
    }

    /**
     * True when the model class explicitly declares the given timestamp
     * constant itself (e.g. `const UPDATED_AT = null` on read-only tables),
     * as opposed to inheriting the default from Eloquent's Model.
     */
    private static function hasOverriddenConstant(string $name): bool
    {
        $class = static::class;

        static $cache = [];

        if (! array_key_exists($class, $cache)) {
            $constant = (new \ReflectionClass($class))->getReflectionConstant($name);
            $cache[$class] = $constant !== false
                && $constant->getDeclaringClass()->getName() !== \Illuminate\Database\Eloquent\Model::class;
        }

        return $cache[$class];
    }

    /**
     * Resolve an attribute by snake_case name, falling back to the matching
     * camelCase column when the snake attribute is not present.
     */
    public function getAttribute($key)
    {
        $value = parent::getAttribute($key);

        if ($value !== null) {
            return $value;
        }

        return parent::getAttribute($this->snakeToCamel($key));
    }

    /**
     * Store values under their camelCase column name so inserts/updates
     * reference the real database columns.
     */
    public function setAttribute($key, $value)
    {
        // Always store under the camelCase column name — the database has no
        // snake_case columns at all, so mapping unconditionally is safe.
        return parent::setAttribute($this->snakeToCamel($key), $value);
    }

    /**
     * Re-key casts by their camelCase column names so casts still apply
     * to values read from the camelCase columns.
     */
    public function getCasts()
    {
        $casts = parent::getCasts();
        $mapped = [];

        foreach ($casts as $key => $cast) {
            $mapped[$this->snakeToCamel($key)] = $cast;
        }

        return $mapped;
    }

    /**
     * Relation foreign-key arguments are passed straight into SQL, so they
     * must reference the real camelCase columns. The transform is idempotent
     * for names that are already camelCase.
     */
    public function hasMany($related, $foreignKey = null, $localKey = null)
    {
        return parent::hasMany($related, $this->fk($foreignKey), $this->fk($localKey));
    }

    public function hasOne($related, $foreignKey = null, $localKey = null)
    {
        return parent::hasOne($related, $this->fk($foreignKey), $this->fk($localKey));
    }

    public function belongsTo($related, $foreignKey = null, $ownerKey = null, $relation = null)
    {
        return parent::belongsTo($related, $this->fk($foreignKey), $this->fk($ownerKey), $relation);
    }

    public function belongsToMany($related, $table = null, $foreignPivotKey = null, $relatedPivotKey = null, $parentKey = null, $relatedKey = null, $relation = null)
    {
        return parent::belongsToMany(
            $related,
            $table,
            $this->fk($foreignPivotKey),
            $this->fk($relatedPivotKey),
            $this->fk($parentKey),
            $this->fk($relatedKey),
            $relation
        );
    }

    protected function snakeToCamel(string $key): string
    {
        return lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $key))));
    }

    private function fk(?string $key): ?string
    {
        return $key === null ? null : $this->snakeToCamel($key);
    }
}

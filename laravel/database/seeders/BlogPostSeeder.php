<?php

namespace Database\Seeders;

use App\Enums\BlogPostStatus;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Tag;
use App\Models\TagOnPost;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogPostSeeder extends Seeder
{
    /**
     * Import the blog/insights content from database/data/blog_posts.json.
     *
     * Idempotent: posts are matched by slug and updated in place; tags and
     * category lookups are resolved by slug. The tags_on_posts pivot carries
     * its own ULID primary key, so rows are created directly (attach() would
     * assume an auto-increment pivot key).
     */
    public function run(): void
    {
        $json = file_get_contents(database_path('data/blog_posts.json'));
        $data = json_decode($json, true);

        $admin = User::first();
        if (! $admin) {
            $admin = User::factory()->create();
        }

        foreach ($data as $item) {
            $category = BlogCategory::where('slug', $item['category'])->first();
            if (! $category) {
                $category = BlogCategory::create([
                    'name' => Str::title(str_replace('-', ' ', $item['category'])),
                    'slug' => $item['category'],
                ]);
            }

            $post = BlogPost::updateOrCreate(
                ['slug' => $item['id']],
                [
                    'title' => $item['title'],
                    'excerpt' => $item['excerpt'],
                    'content' => $item['content'],
                    'featured_image' => $item['featuredImage'],
                    'category_id' => $category->id,
                    'author_id' => $admin->id,
                    'status' => BlogPostStatus::PUBLISHED,
                    'published_at' => $item['publishedAt'],
                    'seo_title' => $item['title'],
                    // seoDescription is varchar(191) in the DB — keep it at a
                    // healthy meta-description length (160 chars is the SEO sweet spot).
                    'seo_description' => Str::limit($item['excerpt'], 158),
                    'seo_keywords' => Str::limit(implode(', ', $item['tags']), 150),
                    'og_image' => $item['featuredImage'],
                ]
            );

            $this->syncTags($post, $item['tags'] ?? []);
        }
    }

    /**
     * Replace the post's tag links (pivot rows created with explicit ULIDs).
     *
     * @param  array<int, string>  $tagSlugs
     */
    private function syncTags(BlogPost $post, array $tagSlugs): void
    {
        $post->tagLinks()->delete();

        foreach ($tagSlugs as $slug) {
            $tag = Tag::firstOrCreate(
                ['slug' => $slug],
                ['name' => Str::title(str_replace('-', ' ', $slug))]
            );

            $post->tagLinks()->create([
                'id' => Str::ulid()->toString(),
                'tag_id' => $tag->id,
            ]);
        }
    }
}

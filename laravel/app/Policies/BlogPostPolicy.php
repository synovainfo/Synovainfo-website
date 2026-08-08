<?php

namespace App\Policies;

class BlogPostPolicy extends BasePolicy
{
    protected string $entity = 'blog_posts';
}

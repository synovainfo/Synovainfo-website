<?php

$controllers = [
    'BlogPostController.php',
    'BlogCategoryController.php',
    'TagController.php',
    'CaseStudyController.php',
    'PortfolioController.php',
    'TeamMemberController.php',
];

$dir = __DIR__ . '/app/Http/Controllers/Admin/';

foreach ($controllers as $file) {
    $path = $dir . $file;
    if (!file_exists($path)) {
        echo "File not found: $path\n";
        continue;
    }

    $content = file_get_contents($path);
    $modelClass = str_replace('Controller.php', '', $file);

    // Index
    $content = preg_replace(
        '/(\$([a-zA-Z]+) = \$query->paginate\([0-9]+\);.*?)(return view\(' . "'admin\..*?index'" . ', compact\(' . "'([^']+)'" . '\)\);)/s',
        '$1if ($request->wantsJson()) {
            return response()->json([
                \'success\' => true,
                \'data\' => $$2->items(),
                \'meta\' => [
                    \'current_page\' => $$2->currentPage(),
                    \'last_page\' => $$2->lastPage(),
                    \'total\' => $$2->total()
                ]
            ]);
        }

        $3',
        $content
    );

    // Store
    $content = preg_replace(
        '/(' . $modelClass . '::create\(\$data\);.*?)(return redirect\(\)->route\(' . "'admin\..*?index'" . '\).*?;)/s',
        '$1if ($request->wantsJson()) {
            return response()->json([
                \'success\' => true,
                \'data\' => ' . $modelClass . '::latest()->first()
            ], 201);
        }

        $2',
        $content
    );

    // Show
    $content = preg_replace(
        '/(public function show\(' . $modelClass . ' \$([a-zA-Z]+)\).*?{.*?)(return view\(' . "'admin\..*?show'" . ', compact\(' . "'([^']+)'" . '\)\);)/s',
        '$1if (request()->wantsJson()) {
            return response()->json([
                \'success\' => true,
                \'data\' => $$2
            ]);
        }

        $3',
        $content
    );

    // Update
    $content = preg_replace(
        '/(\$([a-zA-Z]+)->update\(\$data\);.*?)(return redirect\(\)->route\(' . "'admin\..*?index'" . '\).*?;)/s',
        '$1if ($request->wantsJson()) {
            return response()->json([
                \'success\' => true,
                \'data\' => $$2
            ]);
        }

        $3',
        $content
    );

    // Destroy
    $content = preg_replace(
        '/(\$([a-zA-Z]+)->delete\(\);.*?)(return redirect\(\)->route\(' . "'admin\..*?index'" . '\).*?;)/s',
        '$1if (request()->wantsJson()) {
            return response()->json([
                \'success\' => true,
                \'message\' => \'Record deleted successfully.\'
            ]);
        }

        $3',
        $content
    );

    file_put_contents($path, $content);
    echo "Updated $file\n";
}

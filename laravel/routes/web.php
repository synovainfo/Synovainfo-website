<?php

use Illuminate\Support\Facades\Route;

// -----------------------------------------------------------------------------
// PUBLIC ROUTES
// -----------------------------------------------------------------------------
Route::get('/', [\App\Http\Controllers\PageController::class, 'home'])->name('home');
Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');
Route::get('/about', [\App\Http\Controllers\PageController::class, 'about'])->name('about');
Route::get('/approach', [\App\Http\Controllers\PageController::class, 'approach'])->name('approach');
Route::get('/architecture', [\App\Http\Controllers\PageController::class, 'architecture'])->name('architecture');
Route::get('/contact', [\App\Http\Controllers\ContactController::class, 'index'])->name('contact');
Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'submit'])->name('contact.submit');

Route::prefix('services')->name('services.')->group(function () {
    Route::get('/', [\App\Http\Controllers\ServiceController::class, 'index'])->name('index');
    Route::get('/{slug}', [\App\Http\Controllers\ServiceController::class, 'show'])->name('show');
});

Route::prefix('industries')->name('industries.')->group(function () {
    Route::get('/', [\App\Http\Controllers\IndustryController::class, 'index'])->name('index');
    Route::get('/{slug}', [\App\Http\Controllers\IndustryController::class, 'show'])->name('show');
});

Route::prefix('technologies')->name('technologies.')->group(function () {
    Route::get('/', [\App\Http\Controllers\TechnologyController::class, 'index'])->name('index');
});

Route::prefix('solutions')->name('solutions.')->group(function () {
    Route::get('/', [\App\Http\Controllers\SolutionController::class, 'index'])->name('index');
    Route::get('/{slug}', [\App\Http\Controllers\SolutionController::class, 'show'])->name('show');
});

Route::prefix('portfolio')->name('portfolio.')->group(function () {
    Route::get('/', [\App\Http\Controllers\PortfolioController::class, 'index'])->name('index');
    Route::get('/{slug}', [\App\Http\Controllers\PortfolioController::class, 'show'])->name('show');
});

Route::prefix('case-studies')->name('case_studies.')->group(function () {
    Route::get('/', [\App\Http\Controllers\CaseStudyController::class, 'index'])->name('index');
    Route::get('/{slug}', [\App\Http\Controllers\CaseStudyController::class, 'show'])->name('show');
});

Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/', [\App\Http\Controllers\BlogController::class, 'index'])->name('index');
    Route::get('/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('show');
});

Route::prefix('careers')->name('careers.')->group(function () {
    Route::get('/', [\App\Http\Controllers\CareerController::class, 'index'])->name('index');
    Route::get('/{slug}', [\App\Http\Controllers\CareerController::class, 'show'])->name('show');
    Route::post('/{slug}/apply', [\App\Http\Controllers\CareerController::class, 'apply'])->name('apply');
});

// -----------------------------------------------------------------------------
// AUTHENTICATION ROUTES
// -----------------------------------------------------------------------------
Route::middleware('guest')->group(function () {
    Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'login'])->name('login.post');
});

Route::post('/logout', [\App\Http\Controllers\Auth\LoginController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

// -----------------------------------------------------------------------------
// ADMIN ROUTES
// -----------------------------------------------------------------------------
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    
    Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    // Content Management
    Route::resource('pages', \App\Http\Controllers\Admin\PageController::class);
    Route::resource('blog-posts', \App\Http\Controllers\Admin\BlogPostController::class);
    Route::resource('blog-categories', \App\Http\Controllers\Admin\BlogCategoryController::class);
    Route::resource('tags', \App\Http\Controllers\Admin\TagController::class);
    
    // Taxonomy
    Route::resource('services', \App\Http\Controllers\Admin\ServiceController::class);
    Route::resource('industries', \App\Http\Controllers\Admin\IndustryController::class);
    Route::resource('technologies', \App\Http\Controllers\Admin\TechnologyController::class);
    Route::resource('solutions', \App\Http\Controllers\Admin\SolutionController::class);

    // Case Studies & Portfolio
    Route::resource('case-studies', \App\Http\Controllers\Admin\CaseStudyController::class);
    Route::resource('portfolios', \App\Http\Controllers\Admin\PortfolioController::class);

    // People & Careers
    Route::resource('team-members', \App\Http\Controllers\Admin\TeamMemberController::class);
    Route::resource('careers', \App\Http\Controllers\Admin\CareerController::class);
    Route::resource('career-applications', \App\Http\Controllers\Admin\CareerApplicationController::class)->only(['index', 'show', 'destroy']);

    // Leads & Contacts
    Route::resource('leads', \App\Http\Controllers\Admin\LeadController::class);
    Route::resource('contacts', \App\Http\Controllers\Admin\ContactController::class)->only(['index', 'show', 'destroy']);

    // Marketing & Forms
    Route::resource('forms', \App\Http\Controllers\Admin\FormController::class);
    Route::resource('newsletters', \App\Http\Controllers\Admin\NewsletterController::class);
    Route::resource('subscribers', \App\Http\Controllers\Admin\SubscriberController::class);

    // Media & UI
    Route::resource('media', \App\Http\Controllers\Admin\MediaController::class);
    Route::resource('menus', \App\Http\Controllers\Admin\MenuController::class);
    Route::resource('gallery-albums', \App\Http\Controllers\Admin\GalleryAlbumController::class);

    // System Administration (Super Admin only typically)
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    Route::resource('site-configs', \App\Http\Controllers\Admin\SiteConfigController::class);
    Route::get('audit-logs', [\App\Http\Controllers\Admin\AuditLogController::class, 'index'])->name('audit-logs.index');
});

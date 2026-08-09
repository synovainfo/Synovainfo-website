<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryAlbum;
use App\Http\Requests\Admin\GalleryAlbumRequest;

class GalleryAlbumController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\GalleryAlbum::query()->latest('created_at');
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('id', 'like', "%$search%");
        }
        $galleryAlbums = $query->paginate(15);
        return view('admin.gallery-albums.index', compact('galleryAlbums'));
    }

    public function create()
    {
        return view('admin.gallery-albums.create');
    }

    public function store(\App\Http\Requests\Admin\GalleryAlbumRequest $request)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\GalleryAlbum)->getTable(), 'created_by_id')) {
            $data['created_by_id'] = auth()->id();
            $data['updated_by_id'] = auth()->id();
        }
        \App\Models\GalleryAlbum::create($data);
        return redirect()->route('admin.gallery-albums.index')->with('success', 'GalleryAlbum created successfully.');
    }

    public function show(\App\Models\GalleryAlbum $galleryAlbum)
    {
        return view('admin.gallery-albums.show', compact('galleryAlbum'));
    }

    public function edit(\App\Models\GalleryAlbum $galleryAlbum)
    {
        return view('admin.gallery-albums.edit', compact('galleryAlbum'));
    }

    public function update(\App\Http\Requests\Admin\GalleryAlbumRequest $request, \App\Models\GalleryAlbum $galleryAlbum)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\GalleryAlbum)->getTable(), 'updated_by_id')) {
            $data['updated_by_id'] = auth()->id();
        }
        $galleryAlbum->update($data);
        return redirect()->route('admin.gallery-albums.index')->with('success', 'GalleryAlbum updated successfully.');
    }

    public function destroy(\App\Models\GalleryAlbum $galleryAlbum)
    {
        $galleryAlbum->delete();
        return redirect()->route('admin.gallery-albums.index')->with('success', 'GalleryAlbum deleted successfully.');
    }
}
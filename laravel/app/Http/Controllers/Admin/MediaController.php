<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Http\Requests\Admin\MediaUploadRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Media::query()->latest();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('file_name', 'like', "%{$search}%");
        }

        if ($request->has('mime')) {
            $query->where('mime_type', 'like', $request->get('mime') . '%');
        }

        $mediaItems = $query->paginate(24);

        return view('admin.media.index', compact('mediaItems'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MediaUploadRequest $request)
    {
        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getClientMimeType();
        $size = $file->getSize();

        $path = $file->store('media', 'public');
        $url = Storage::disk('public')->url($path);

        Media::create([
            'name' => pathinfo($originalName, PATHINFO_FILENAME),
            'file_name' => $originalName,
            'mime_type' => $mimeType,
            'disk' => 'public',
            'path' => $path,
            'url' => $url,
            'size' => $size,
            'alt_text' => $request->input('alt_text'),
            'caption' => $request->input('caption'),
            'collection' => $request->input('collection', 'default'),
            'uploaded_by_id' => auth()->id(),
        ]);

        return redirect()->route('admin.media.index')
            ->with('success', 'Media uploaded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Media $media)
    {
        return response()->json($media);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Media $media)
    {
        if ($media->path && Storage::disk($media->disk ?? 'public')->exists($media->path)) {
            Storage::disk($media->disk ?? 'public')->delete($media->path);
        }

        $media->delete();

        return redirect()->route('admin.media.index')
            ->with('success', 'Media deleted successfully.');
    }
}

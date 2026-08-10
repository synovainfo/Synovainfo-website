<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DownloadRequest;
use App\Models\Download;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    public function index(Request $request)
    {
        $query = Download::query()->latest('created_at');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('category', 'like', "%{$search}%");
        }

        $downloads = $query->paginate(10);

        return view('admin.downloads.index', compact('downloads'));
    }

    public function create()
    {
        return view('admin.downloads.create');
    }

    public function store(DownloadRequest $request)
    {
        $data = $request->validated();
        $data['is_featured'] = $request->has('is_featured') && $request->get('is_featured') ? true : false;

        Download::create($data);

        return redirect()->route('admin.downloads.index')
            ->with('success', 'Download created successfully.');
    }

    public function show(Download $download)
    {
        return view('admin.downloads.show', compact('download'));
    }

    public function edit(Download $download)
    {
        return view('admin.downloads.edit', compact('download'));
    }

    public function update(DownloadRequest $request, Download $download)
    {
        $data = $request->validated();
        $data['is_featured'] = $request->has('is_featured') && $request->get('is_featured') ? true : false;

        $download->update($data);

        return redirect()->route('admin.downloads.index')
            ->with('success', 'Download updated successfully.');
    }

    public function destroy(Download $download)
    {
        $download->delete();

        return redirect()->route('admin.downloads.index')
            ->with('success', 'Download deleted successfully.');
    }
}

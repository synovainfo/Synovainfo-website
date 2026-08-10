<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ResourceRequest;
use App\Models\Resource;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    public function index(Request $request)
    {
        $query = Resource::query()->latest('created_at');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
        }

        $resources = $query->paginate(10);

        return view('admin.resources.index', compact('resources'));
    }

    public function create()
    {
        return view('admin.resources.create');
    }

    public function store(ResourceRequest $request)
    {
        $data = $request->validated();
        $data['created_by_id'] = auth()->id();

        Resource::create($data);

        return redirect()->route('admin.resources.index')
            ->with('success', 'Resource created successfully.');
    }

    public function show(Resource $resource)
    {
        return view('admin.resources.show', compact('resource'));
    }

    public function edit(Resource $resource)
    {
        return view('admin.resources.edit', compact('resource'));
    }

    public function update(ResourceRequest $request, Resource $resource)
    {
        $data = $request->validated();
        $data['updated_by_id'] = auth()->id();

        $resource->update($data);

        return redirect()->route('admin.resources.index')
            ->with('success', 'Resource updated successfully.');
    }

    public function destroy(Resource $resource)
    {
        $resource->delete();

        return redirect()->route('admin.resources.index')
            ->with('success', 'Resource deleted successfully.');
    }
}

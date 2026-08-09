<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Http\Requests\Admin\MenuRequest;

class MenuController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Menu::query()->latest('created_at');
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('id', 'like', "%$search%");
        }
        $menus = $query->paginate(15);
        return view('admin.menus.index', compact('menus'));
    }

    public function create()
    {
        return view('admin.menus.create');
    }

    public function store(\App\Http\Requests\Admin\MenuRequest $request)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Menu)->getTable(), 'created_by_id')) {
            $data['created_by_id'] = auth()->id();
            $data['updated_by_id'] = auth()->id();
        }
        \App\Models\Menu::create($data);
        return redirect()->route('admin.menus.index')->with('success', 'Menu created successfully.');
    }

    public function show(\App\Models\Menu $menu)
    {
        return view('admin.menus.show', compact('menu'));
    }

    public function edit(\App\Models\Menu $menu)
    {
        return view('admin.menus.edit', compact('menu'));
    }

    public function update(\App\Http\Requests\Admin\MenuRequest $request, \App\Models\Menu $menu)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Menu)->getTable(), 'updated_by_id')) {
            $data['updated_by_id'] = auth()->id();
        }
        $menu->update($data);
        return redirect()->route('admin.menus.index')->with('success', 'Menu updated successfully.');
    }

    public function destroy(\App\Models\Menu $menu)
    {
        $menu->delete();
        return redirect()->route('admin.menus.index')->with('success', 'Menu deleted successfully.');
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Http\Requests\Admin\SubscriberRequest;

class SubscriberController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Subscriber::query()->latest('created_at');
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('id', 'like', "%$search%");
        }
        $subscribers = $query->paginate(15);
        return view('admin.subscribers.index', compact('subscribers'));
    }

    public function create()
    {
        return view('admin.subscribers.create');
    }

    public function store(\App\Http\Requests\Admin\SubscriberRequest $request)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Subscriber)->getTable(), 'created_by_id')) {
            $data['created_by_id'] = auth()->id();
            $data['updated_by_id'] = auth()->id();
        }
        \App\Models\Subscriber::create($data);
        return redirect()->route('admin.subscribers.index')->with('success', 'Subscriber created successfully.');
    }

    public function show(\App\Models\Subscriber $subscriber)
    {
        return view('admin.subscribers.show', compact('subscriber'));
    }

    public function edit(\App\Models\Subscriber $subscriber)
    {
        return view('admin.subscribers.edit', compact('subscriber'));
    }

    public function update(\App\Http\Requests\Admin\SubscriberRequest $request, \App\Models\Subscriber $subscriber)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Subscriber)->getTable(), 'updated_by_id')) {
            $data['updated_by_id'] = auth()->id();
        }
        $subscriber->update($data);
        return redirect()->route('admin.subscribers.index')->with('success', 'Subscriber updated successfully.');
    }

    public function destroy(\App\Models\Subscriber $subscriber)
    {
        $subscriber->delete();
        return redirect()->route('admin.subscribers.index')->with('success', 'Subscriber deleted successfully.');
    }
}
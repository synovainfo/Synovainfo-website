<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Http\Requests\Admin\TeamMemberRequest;

class TeamMemberController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\TeamMember::query()->latest('created_at');
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('id', 'like', "%$search%");
        }
        $teamMembers = $query->paginate(15);
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $teamMembers->items(),
                'meta' => [
                    'current_page' => $teamMembers->currentPage(),
                    'last_page' => $teamMembers->lastPage(),
                    'total' => $teamMembers->total()
                ]
            ]);
        }

        return view('admin.team-members.index', compact('teamMembers'));
    }

    public function create()
    {
        return view('admin.team-members.create');
    }

    public function store(\App\Http\Requests\Admin\TeamMemberRequest $request)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\TeamMember)->getTable(), 'created_by_id')) {
            $data['created_by_id'] = auth()->id();
            $data['updated_by_id'] = auth()->id();
        }
        \App\Models\TeamMember::create($data);
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => TeamMember::latest()->first()
            ], 201);
        }

        return redirect()->route('admin.team-members.index')->with('success', 'TeamMember created successfully.');
    }

    public function show(\App\Models\TeamMember $teamMember)
    {
        return view('admin.team-members.show', compact('teamMember'));
    }

    public function edit(\App\Models\TeamMember $teamMember)
    {
        return view('admin.team-members.edit', compact('teamMember'));
    }

    public function update(\App\Http\Requests\Admin\TeamMemberRequest $request, \App\Models\TeamMember $teamMember)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\TeamMember)->getTable(), 'updated_by_id')) {
            $data['updated_by_id'] = auth()->id();
        }
        $teamMember->update($data);
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $teamMember
            ]);
        }

        return redirect()->route('admin.team-members.index')->with('success', 'TeamMember updated successfully.');
    }

    public function destroy(\App\Models\TeamMember $teamMember)
    {
        $teamMember->delete();
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Record deleted successfully.'
            ]);
        }

        return redirect()->route('admin.team-members.index')->with('success', 'TeamMember deleted successfully.');
    }
}
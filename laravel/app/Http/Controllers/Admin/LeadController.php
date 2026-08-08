<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead as LeadModel;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = LeadModel::query()->latest('createdAt');
        
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
        }

        $leads = $query->paginate(15);
        return view('admin.leads.index', compact('leads'));
    }

    /**
     * Display the specified resource.
     */
    public function show(LeadModel $lead)
    {
        return view('admin.leads.show', compact('lead'));
    }

    /**
     * Update the specified resource status.
     */
    public function update(Request $request, LeadModel $lead)
    {
        $request->validate([
            'status' => ['required', 'string', 'max:50'],
        ]);

        $lead->update([
            'status' => $request->input('status'),
        ]);

        return redirect()->back()->with('success', 'Lead status updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeadModel $lead)
    {
        $lead->delete();

        return redirect()->route('admin.leads.index')
            ->with('success', 'Lead deleted successfully.');
    }
}

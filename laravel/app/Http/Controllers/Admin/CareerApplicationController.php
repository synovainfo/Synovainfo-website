<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerApplication;


class CareerApplicationController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\CareerApplication::query()->latest('created_at');
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('id', 'like', "%$search%");
        }
        $careerApplications = $query->paginate(15);
        return view('admin.career-applications.index', compact('careerApplications'));
    }

    public function show(\App\Models\CareerApplication $careerApplication)
    {
        return view('admin.career-applications.show', compact('careerApplication'));
    }

    public function destroy(\App\Models\CareerApplication $careerApplication)
    {
        $careerApplication->delete();
        return redirect()->route('admin.career-applications.index')->with('success', 'CareerApplication deleted successfully.');
    }
}
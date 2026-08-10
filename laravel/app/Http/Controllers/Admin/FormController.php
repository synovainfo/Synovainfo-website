<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Form;
use Illuminate\Http\Request;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Form::query()->latest('created_at');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
        }

        $forms = $query->paginate(15);
        return view('admin.forms.index', compact('forms'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.forms.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(\App\Http\Requests\Admin\FormRequest $request)
    {
        Form::create($request->validated());

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Form $form)
    {
        return view('admin.forms.show', compact('form'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Form $form)
    {
        return view('admin.forms.edit', compact('form'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(\App\Http\Requests\Admin\FormRequest $request, Form $form)
    {
        $form->update($request->validated());

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Form $form)
    {
        $form->delete();

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form deleted successfully.');
    }
}

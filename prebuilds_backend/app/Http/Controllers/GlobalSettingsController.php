<?php
namespace App\Http\Controllers;

use App\Models\GlobalSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GlobalSettingsController extends Controller
{

    public function __construct()
    {
        $user                  = Auth::guard('sanctum')->user();


        if ($user) {
            $this->user_role = $user->user_role;
            $this->user_id   = $user->user_id;
        } else {
            $this->user_role = null;
            $this->user_id   = null;
        }
    }

    public function index()
    {

        if ($this->user_role !== 'Owner') {
            return response()->json(['databaseError' => 'Action Not Authorized. 01']);
        }

        // Fetch all the settings and map them to include key, value, and setting_description
        $globalSettings = GlobalSettings::all()->mapWithKeys(function ($setting) {
            return [
                $setting->key => [
                    'value'               => $setting->value,
                    'setting_description' => $setting->setting_description, // Include description
                ],
            ];
        });

        return response()->json(['globalSettings' => $globalSettings]);
    }

    /**
     * Show the form for creating a new resource.
     */

    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        if ($this->user_role !== 'Owner') {
            return response()->json(['databaseError' => 'Action Not Authorized. 02'], 403);
        }
        

        DB::beginTransaction();

        try {

            GlobalSettings::query()->delete();
            $newGlobalSettings = $request->all();

            foreach ($newGlobalSettings as $key => $setting) {

                GlobalSettings::create([
                    'key'                 => $key,
                    'value'               => $setting['value'],
                    'setting_description' => $setting['setting_description'],
                ]);
            }
            DB::commit();

            return response()->json(['successMessage' => 'Global settings updated successfully.']);

        } catch (\Exception $error) {
            Log::error('Transaction failed, rolling back...', ['error' => $error->getMessage()]);
            DB::rollBack();

            return response()->json(['databaseError' => 'An error occurred while saving settings.', 'errorF' => $error->getMessage()]);
        }

    }

    /**
     * Display the specified resource.
     */

    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(string $id)
    {

        //
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request)
    {
        if ($this->user_role !== 'Owner') {
            return response()->json(['databaseError' => 'Action Not Authorized. 03'], 422);
        }

        $newProductDuration = $request->new_product_duration;

        if ($newProductDuration <= 0) {
            return response()->json(['databaseError' => 'Product Duration must be above 0.'], 422);
        }

        $customMessages = [
            'new_product_duration.required' => 'New Product Duration is required.',
            'new_product_duration.integer'  => 'New Product Duration must be an integer.',
        ];

        $validator = Validator::make($request->all(), [
            'new_product_duration' => 'required|integer',
        ], $customMessages);

        if ($validator->fails()) {
            $errorMessage = $validator->errors()->first();
            return response()->json(['databaseError' => $errorMessage], 422);
        }

        $globalSettings = GlobalSettings::first();

        // If no record exists, create a new one
        if (! $globalSettings) {
            $globalSettings = new GlobalSettings();
        }

        // Update the new_product_duration
        $globalSettings->new_product_duration = $newProductDuration;
        $globalSettings->save();

        return response()->json(['successMessage' => 'New Product Duration updated successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(string $id)
    {
        //
    }
}

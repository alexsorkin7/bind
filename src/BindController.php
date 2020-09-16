<?php

namespace Als\Bind;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class BindController extends Controller
{
    public $tables; // [tableName,tableName,...]
    public $auth; // true/false

    public function __construct() {
        if($this->auth) $this->middleware('auth');
    }

    private function modelPrefix() {
        if(explode('.',\Illuminate\Foundation\Application::VERSION)[0] < 8) return "\\App\\";
        else return "\\App\\Models\\";
    }

    public function index() {
        $tables = [];
        foreach ($this->tables as $tableName) {
            $tableModelName = self::modelPrefix().ucfirst(substr($tableName,0,-1));
            if ($this->auth) {
                if(Auth::check()) {
                    $tableName = $tableName;
                    $tables[$tableName] = auth()->user()->$tableName()->all();
                }
            } else $tables[$tableName] = $tableModelName::all();
        }
        return $tables;
    }

    public function store(Request $request) {
        $tables = json_decode($request->all()['data'],true); //Get the tables data
        foreach ($tables as $tableName => $table) {
            $tableModelName = self::modelPrefix().ucfirst(substr($tableName,0,-1)); // Do some polymorphism with name of table
            foreach ($table as $id => $data) {
                if($id == 'new') {
                    if($this->auth && !isset($data['user_id'])) {
                        $data['user_id'] = auth()->user()->id;
                    }
                    $newRecord = $tableModelName::create($data); // Creating new record in Db
                    return $newRecord;
                }
                if($data == 'remove') { //If record removed
                    $tableModelName::get()->firstWhere('id',$id)->delete(); // Removing a record
                    $result[$tableName][$id] = 'removed'; // Return removed to result
                } else { // If record updated
                    $tableModelName::get()->firstWhere('id',$id)->update($data); // Updating a record
                    $result[$tableName][$id] = $tableModelName::get()->firstWhere('id',$id); // Return updated record to results
                }
            }
        }
        return $result;
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class saveplaceAPI extends Controller
{
    function savePlace(Request $request)
    {
        $u_id = $request->input('u_id');
        $place = $request->input('place');

        try 
        {
            $res = DB::insert('INSERT INTO places (p_uid, p_name) values (?, ?)', [$u_id , $place]);
        }
        catch(Exception $e)
        {
            $res = 0;
        }

        return $res;
    }

}
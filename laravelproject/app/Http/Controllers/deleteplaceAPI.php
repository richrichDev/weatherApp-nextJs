<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class deleteplaceAPI extends Controller
{
    function deletePlace(Request $request)
    {
        $u_id = $request->input('u_id');
        $place = $request->input('place');

        try 
        {
            $res = DB::table('places')->where('p_uid', '=', $u_id)->where('p_name', '=' , $place)->delete();
        }
        catch(Exception $e)
        {
            $res = 0;
        }

        return $res;
    }

}
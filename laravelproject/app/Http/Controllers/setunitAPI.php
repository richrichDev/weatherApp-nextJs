<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class setunitAPI extends Controller
{
    function setUnit(Request $request)
    {
        $up_uid = $request->input('up_uid');
        $up_unit = $request->input('up_unit');

        try 
        {
            $res1 = DB::select("SELECT * FROM user_profile WHERE up_uid = $up_uid");
            if(sizeof($res1) > 0)
            {
                $affected = DB::table('user_profile')
                    ->where('up_uid', $up_uid)
                    ->update(['up_unit' => $up_unit]);
            }
            else
            {
                $affected = DB::insert('INSERT INTO user_profile (up_uid, up_unit) values (?, ?)', [$up_uid , $up_unit]);
            }
        }
        catch(Exception $e)
        {

        }

        return $affected;
    }

}
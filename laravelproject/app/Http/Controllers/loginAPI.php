<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class loginAPI extends Controller
{
    function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');


        $res1 = DB::select("SELECT * FROM users WHERE u_email LIKE '$email' AND u_password LIKE '$password'");
    
        // $jsonRes = {};

        if(sizeof($res1) == 1)
        {
            foreach ($res1 as $res)
            {
                $id = $res->u_id;
                $jsonRes["conn"] = "success";
                $jsonRes["u_id"] = $res->u_id;
                $jsonRes["u_email"] = $res->u_email;
                $jsonRes["u_password"] = $res->u_password;
            }
            $res2 = DB::select("SELECT * FROM user_profile WHERE up_uid = $id");
            if(sizeof($res2) > 0)
            {
                foreach ($res2 as $res) {
                    $jsonRes["unit"] = $res->up_unit;
                }
            }
            else
            {
                $jsonRes["unit"] = "";
            }
            $res3 = DB::select("SELECT * FROM places WHERE p_uid = $id");
            if(sizeof($res3) > 0)
            {
                $i = 0;
                foreach ($res3 as $res) {
                    // $item = '{place: '.$res->p_name.'}';
                    // $places[$i] = $item;
                    $myArray = array("place" => $res->p_name);
                    $places[$i] = $myArray;
                    $i = $i+1;
                }
                // echo json_encode($places);
                $jsonRes["places"] = $places;
            }
            else
            {
                $jsonRes["unit"] = "";
            }
            return $jsonRes;
        }
        else
        {
            return response()->json([
                'conn' => 'failed',
            ]);
        }

    }

    function registerAcc(Request $request)
    {
        $u_name = $request->input('u_name');
        $u_email = $request->input('u_email');
        $u_password = $request->input('u_password');

        try 
        {
            $res = DB::insert('INSERT INTO users (u_name, u_email, u_password) values (?, ?, ?)', [$u_name , $u_email, $u_password]);
            if($res == 1)
            {
                $res1 = DB::select("SELECT * FROM users WHERE u_email LIKE '$u_email' AND u_password LIKE '$u_password'");
                foreach ($res1 as $res)
                {
                    $id = $res->u_id;
                    $jsonRes["conn"] = "success";
                    $jsonRes["u_id"] = $res->u_id;
                    $jsonRes["u_email"] = $res->u_email;
                    $jsonRes["u_password"] = $res->u_password;
                    $jsonRes["places"] = "";
                    $jsonRes["unit"] = "";
                }
            }
        }
        catch(Exception $e)
        {
            $res = 0;
        }

        return $jsonRes;
    }

}

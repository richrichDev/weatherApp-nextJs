<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class weathernowAPI extends Controller
{
    function getNowWeather(Request $request)
    {
        $lat = $request->input('lat');
        $lng = $request->input('lng');


        $apicallnow = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lng&appid=55bcf4cde23e77ea178f6059a60a7051";
        // $apicall7Days = "https://api.openweathermap.org/data/2.5/forecast/daily?lat=34.5&lon=33.5&cnt=7&appid=55bcf4cde23e77ea178f6059a60a7051";

        $json = json_decode(file_get_contents($apicallnow), true);
        return $json;
    }

}

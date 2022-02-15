import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { Fragment } from 'react'
import { useState } from 'react'
import axios from 'axios';
import Geocode from "react-geocode";
import { TagsInput } from "react-tag-input-component"; 
import React from 'react';
import { Tab } from '@headlessui/react'
import moment from 'moment'
import Router from 'next/router'
import useRouter from 'next/router'


class Result extends React.Component {

    constructor(props)
    {
        super(props);

        this.state = {
            dataforcast: [],
        }

        this.lat = this.getParameterByName('lat');
        this.lng = this.getParameterByName('lng');
        this.appid = this.getParameterByName('appid');
        this.unit = this.getParameterByName('unit');;
        this.place = this.getParameterByName('place');;


        this.getForcast(this.lat, this.lng, this.appid, this.unit);
    }

    async getForcast(lat,lng,appid,unit)
    {
        await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lng+"&exclude=hourly,minutely,current&appid="+appid+"&units="+unit).then(resp => {
            // this.state.dataforcast = resp.data;
            this.setState({dataforcast: resp.data});
            console.log(this.state.dataforcast); 
        })
        .catch(err => {
            console.error(err);
        });
    }

    getParameterByName(name) {
        if(typeof window != 'undefined')
        {
            var url = window.location.href;
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }
    }

    render() {
        return(
            <div>
                <h1 className={styles.title}>{this.place} Weather</h1>
                {
                    this.state.dataforcast == "" ? 
                    null
                    :
                    <div>
                        <h3>{this.placeTitle}</h3>
                        <table className={styles.mytable}>
                            <thead>

                            </thead>
                            <tbody>
                                <tr>
                                {
                                    this.state.dataforcast.daily.map((item, index) => {
                                        return (
                                            <>
                                                <td className={styles.tablecolumn}>
                                                <Image
                                                    src={"/"+item.weather[0].main+".jpg"}
                                                    alt={item.weather[0].main}
                                                    width={70}
                                                    height={70}
                                                />
                                                    <h6> {index == 0 ? <p>Today : {moment(item.dt*1000).format("MMM Do YYYY")}</p> : <p>Date : {moment(item.dt*1000).format("MMM Do YYYY")}</p>}</h6>
                                                    <h6>Weather : {item.weather[0].main}</h6>
                                                    <h6>temp : {item.temp.day}</h6>
                                                    <h6>feels like : {item.feels_like.day}</h6>
                                                    <h6>Max temp : {item.temp.max}</h6>
                                                    <h6>Min temp : {item.temp.min}</h6>
                                                </td>
                                            </>
                                        );
                                    })
                                }
                                </tr>
                            </tbody>
                        </table>

                        
                        
                    </div>
                }
            </div>
        );
    }
}


export default Result;

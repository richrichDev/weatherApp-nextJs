import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/weather.module.css'
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
import { withRouter } from 'next/router'


Geocode.setApiKey("AIzaSyC4dO-nI08oDFwVpcqIQn7NY5Slwjvnnro");
Geocode.setLanguage("en");



class Weather extends React.Component {
  
  constructor(props){
    super(props);

    this.profile = [];

    if (typeof window !== 'undefined') {
        if(localStorage.getItem("profile") != "undefined")
        {
            this.profile = JSON.parse(localStorage.getItem("profile"));
        }
    }

    this.state = {
        selected:"",
        data: [],
        dataforcast: [],
        showSaveButton: false,
        places: [],
        placeFound : 0,
        unit: "standard",
    }
    // console.log(this.state.unit);
    // this.state.unit = this.profile.unit;
    // this.setState({unit: this.profile.unit});
    let u = this.profile.unit;
    console.log(this.profile.unit);
    this.state.unit = u;

    this.lat = 0;
    this.lng = 0;

    this.router = Router;

    this.placeTitle = "";

    

    this.appid = "55bcf4cde23e77ea178f6059a60a7051";

    

    if (typeof window !== 'undefined') {
        
        if(localStorage.getItem("places") != "undefined")
        {
            // let json = JSON.parse(localStorage.getItem("places"));
            // let objlength = Object.keys(json).length;
            // for (let i = 0; i < objlength; i++) {
            //     this.state.places.push(json["place"+(i+1)]);
            // }
            // console.log(this.places);
            this.state.places = JSON.parse(localStorage.getItem("places"));
            for(let i = 0 ; i <this.state.places.length ; i++)
            {
                this.state.places[i]["clicked"] = 0; 
            }
            console.log(this.state.places);
            // console.log(this.state.places[0].place);
        }
        else
            this.state.places = [];

        if(localStorage.getItem("profile") != "undefined")
        {
            this.profile = JSON.parse(localStorage.getItem("profile"));
            console.log(this.profile.unit);
            // this.state.unit = this.profile.unit;
            this.setState({unit : this.profile.unit});
            console.log(this.state.unit);
        }
        else
        {
            
        }

    }
    
  }

    async getNowWeather(lat, lng)
    {
        // const res = await axios.get("http://127.0.0.1:8000/api/nowdata?lat="+lat+"&lng="+lng);
        const res = await axios.get("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid="+this.appid+"&units="+this.state.unit);
        // this.state.data = res.data;
        this.setState({data: res.data});
        // console.log(this.state.data); 
    }


    async getForcast(lat,lng)
    {
        await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lng+"&exclude=hourly,minutely,current&appid="+this.appid+"&units="+this.state.unit).then(resp => {
            // this.state.dataforcast = resp.data;
            this.setState({dataforcast: resp.data});
            console.log(this.state.dataforcast); 
        })
        .catch(err => {
            console.error(err);
        });
    }


    getLongLat(address)
    {
        this.setState({selected: address});
        this.placeTitle = address;
        Geocode.fromAddress(address).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                this.lat = lat;
                this.lng = lng;
                // this.getNowWeather(lat,lng);
                // this.getForcast(lat,lng);

                for(let i = 0 ; i < this.state.places.length ; i++)
                {
                    if(this.state.places[i].place == address)
                        this.state.places[i].clicked = 1;
                    else
                        this.state.places[i].clicked = 0;
                }
                console.log(this.state.places);

                this.setState({showSaveButton: true});
                this.setState({placeFound: 1});
            },
            (error) => {
                this.setState({placeFound: 0});
                alert("Address not found")
            }
        )
    }


    async savePlace(place)
    {
        let exist = 0;
        for (let i = 0 ; i < this.state.places.length ; i++) {
            console.log(place + "==" + this.state.places[i].place);
            if(place == this.state.places[i].place)
            {
                exist = 1;
                break;
            }
        }
        if(exist == 0)
        {
            console.log("http://127.0.0.1:8000/api/saveplace?u_id="+this.profile.u_id+"&place="+place);
            await axios.get("http://127.0.0.1:8000/api/saveplace?u_id="+this.profile.u_id+"&place="+place).then(resp => {
                if(resp.data == 1)
                {
                    this.setState({places: [...this.state.places, {"place": place}]});
                    localStorage.setItem("places",JSON.stringify(this.state.places));
                }
                else
                    alert("Error...");
            })
            .catch(err => {
                console.error(err);
            });
            
        }
        else
            alert("Adress allready saved to favorites");       
    }


    async deletePlace(place)
    {
        await axios.get("http://127.0.0.1:8000/api/deleteplace?u_id="+this.profile.u_id+"&place="+place).then(resp => {
            if(resp.data > 0)
            {
                for (let i = 0 ; i < this.state.places.length ; i++) {
                    if(place == this.state.places[i].place)
                    {
                        this.state.places.splice(i, 1); 
                        break;
                    }
                }
                this.setState({places: this.state.places});
                localStorage.setItem("places" ,JSON.stringify(this.state.places));
            }
            else
                alert("Error...");
        })
        .catch(err => {
            console.error(err);
        });
    }


    onInputchange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    async setUnit(unit)
    {
        console.log(this.profile.u_id);
        await axios.get("http://127.0.0.1:8000/api/setunit?up_uid="+this.profile.u_id+"&up_unit="+unit).then(resp => {
            this.setState({unit: unit})
            this.profile.unit = unit;
            localStorage.setItem("profile",JSON.stringify(this.profile));
            if(this.state.selected != "")
                this.getLongLat(this.state.selected);
        })
        .catch(err => {
            alert("Error connecting to server");
        });
    }


    checkResult()
    {
        this.props.router.push({
            pathname: '/weather_result',
            query: { place: this.placeTitle, lat: this.lat , lng: this.lng , unit: this.state.unit, appid: this.appid},
        })
    }


    logout()
    {
        localStorage.clear();
        this.router.replace({
            pathname: '/',
        })
    }

  
  render()
  {
    return (
        <div className={styles.box}>
            <div>
                <button className={styles.logoutbtn} onClick={()=>{this.logout()}}>Log out</button>
            </div>

            <div className={styles.listblock}>
                <h4>Places saved</h4>
                <div className={styles.placeslist}>
                    { 
                        (this.state.places.length > 0 ? 
                        this.state.places.map((place, index) => {
                            return(place.clicked == 0 ?
                            <><div className={styles.eachplacenotclicked}>
                                <h6 className={styles.placenotclicked} onClick={() => this.getLongLat(place.place)}>{place.place}</h6>
                                <p className={styles.xdelete} onClick={() => this.deletePlace(place.place)}>X</p>
                            </div></>
                            :
                            <><div className={styles.eachplaceclicked}>
                                <h6 className={styles.placenotclicked} onClick={() => this.getLongLat(place.place)}>{place.place}</h6>
                                <p className={styles.xdelete} onClick={() => this.deletePlace(place.place)}>X</p>
                            </div></>)
                        })
                        : null) 
                    }
                </div>
                
            </div>
            
            <div className={styles.unitblock}>
                <h4>Unit selected: {this.state.unit}</h4>
                <button className={styles.unitnotclicked} onClick={()=>this.setUnit("standard")}>standard</button>
                <button className={styles.unitnotclicked} onClick={()=>this.setUnit("metric")}>metric</button>
                <button className={styles.unitnotclicked} onClick={()=>this.setUnit("imperial")}>imperial</button>
            </div>
            <h3>Search for a city</h3>
            <input
                onChange={(e)=>{
                        this.setState({selected: (e.target.value)});
                        this.setState({placeFound: 0});
                        this.setState({showSaveButton: false});
                        for(let i = 0 ; i < this.state.places.length ; i++)
                        {
                            this.state.places[i].clicked = 0;
                        }
                    }
                }
                name="selected"
                value={this.state.selected}
                placeholder="Search for a place"
            />
            <button onClick={() => this.getLongLat(this.state.selected)}>Search</button>
            {
                this.state.showSaveButton == true ? 
                <button onClick={() => this.savePlace(this.state.selected)}>Add to Favorites</button> 
                : 
                null 
            }
            
            {
                this.state.placeFound == 0 ?
                null
                :
                <>
                    <h4>Found</h4>
                    <button onClick={()=>this.checkResult()}>View Weather</button>
                </>
            }
        

            

            {
                this.state.dataforcast == "" ? 
                null
                :
                <div>
                    <h3>{this.placeTitle}</h3>
                    {
                        this.state.dataforcast.daily.map((item, index) => {
                            return (
                                <div>
                                    <h6> {index == 0 ? <p>Today : {moment(item.dt*1000).format("MMM Do YYYY")}</p> : <p>Date : {moment(item.dt*1000).format("MMM Do YYYY")}</p>}</h6>
                                    <h6>Weather : {item.weather[0].main}</h6>
                                    <h6>temp : {item.temp.day}</h6>
                                    <h6>feels like : {item.feels_like.day}</h6>
                                    <h6>Max temp : {item.temp.max}</h6>
                                    <h6>Min temp : {item.temp.min}</h6>
                                    <h6>----------------------------------------------------------------</h6>
                                </div>
                            );
                        })
                    }
                    
                </div>
            }

        </div>
    )
  }
  

}



export default withRouter(Weather);

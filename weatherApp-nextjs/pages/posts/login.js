import Link from 'next/link';
import axios from 'axios';
import React from 'react';
import styles from '../../styles/login.module.css'
import react from 'react';
import Router from 'next/router'
import Image from 'next/image'



class Login extends react.Component {  
    
    constructor(props)
    {
        super(props);
        this.email = "";
        this.password = "";
        this.name = "";
        this.profile = [];
        this.router = Router;

        this.state = {
            signinType : "login",
        }

        // console.log(this.getwindowsize());
    }

    getwindowsize()
    {
        if (typeof window !== "undefined") {
            let height = window.innerHeight;
            let width = window.innerWidth;
            
            // document.getElementsByClassName("loginform").style.backgroundColor = "red";
            // console.log(x);

            return {
                height,
                width
            }
        }
        return null;
    }

    async loginFunction()
    {
        if(this.email == "" || this.password == "")
        {
            alert("Fill all the fields");
        }
        else
        {
            const res = await axios.get("http://127.0.0.1:8000/api/loginapi?email="+this.email+"&password="+this.password);
            
            if(res.data.conn == "failed")
            {
                alert("Wrong username and password");
            }
            else
            {
                this.profile = res.data;
                localStorage.setItem("profile",JSON.stringify(this.profile));        
                localStorage.setItem("places", JSON.stringify(this.profile.places));
                this.router.push({
                    pathname: '/weather',
                })
            }
        } 
    }

    async registerFunction()
    {
        await axios.get("http://127.0.0.1:8000/api/registerapi?u_name="+this.name+"&u_email="+this.email+"&u_password="+this.password).then(resp => {
            this.profile =  resp.data;
            localStorage.setItem("profile",JSON.stringify(this.profile));
            localStorage.setItem("places", JSON.stringify(this.profile.places));
            this.router.push({
                pathname: '/weather',
            })
        })
        .catch(err => {
            alert("This email is already registered");
        });
    }

    registerAcc()
    {
        this.setState({signinType: "register"});
    }

    loginAcc()
    {
        this.setState({signinType: "login"});
    }

    render() {
        return (
            <div className={styles.pageback}>
                {this.state.signinType == "login" ? 
                <div className={styles.loginform}>
                    <h1>Login</h1>
                    <div className={styles.datablock}>
                        <h4>Email</h4>
                        <input className={styles.inputemail}
                            type="text"
                            placeholder='Email'
                            onChange={(e)=>this.email = (e.target.value)}
                        ></input>
                    </div>
                    
                    <div className={styles.datablock}>
                        <h4>Password</h4>
                        <input className={styles.inputpass}
                            type="text"
                            placeholder='Password'
                            onChange={(e)=>this.password = (e.target.value)}
                        ></input>
                    </div>
                    
                    <button onClick={() => this.loginFunction()}>Log in</button>
                    <h6 onClick={() => this.registerAcc()}>Dont have an account ?</h6>
                </div>
                :
                <div className={styles.loginform}>
                    <h1>Register</h1>
                    <div className={styles.datablock}>
                        <h4>Name</h4>
                        <input className={styles.inputname}
                            type="text"
                            placeholder='Name'
                            onChange={(e)=>this.name = (e.target.value)}
                        ></input>
                    </div>

                    <div className={styles.datablock}>
                        <h4>Email</h4>
                        <input className={styles.inputemail}
                            type="text"
                            placeholder='Email'
                            onChange={(e)=>this.email = (e.target.value)}
                        ></input>
                    </div>

                    <div className={styles.datablock}>
                        <h4>Password</h4>
                        <input className={styles.inputpass}
                            type="text"
                            placeholder='Password'
                            onChange={(e)=>this.password = (e.target.value)}
                        ></input>
                    </div>
                    <button onClick={() => this.registerFunction()}>Register</button>
                    <h6 onClick={() => this.loginAcc()}>Allready have an account</h6>
                </div>}
            </div>
            
            
            
            
        )
    }
  
}

export default Login;
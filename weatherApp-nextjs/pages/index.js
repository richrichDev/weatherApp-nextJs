import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import React from 'react';
import Login from './posts/login';


function Home() {  
  return (
    <div>
      <Login />
    </div>
  )
}

export default Home;

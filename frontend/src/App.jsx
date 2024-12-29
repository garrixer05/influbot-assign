import { useEffect, useState } from 'react'
import './App.css'
import {MyCalendar} from "./components/MyCalendar"
import axios from 'axios'
import { LOGIN_WITH_GOOGLE } from './utils/apiRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAuth } from './feature/authSlice'
import { setUserEvents } from './feature/eventSlice'
import { useCookies } from 'react-cookie'


function App() {
  const [cookies] = useCookies("auth");
  const {isAuthenticated} = useSelector((store)=>store.auth)
  const dispatch = useDispatch();

  const loginWithGoogle = async ()=>{
    window.location.href = LOGIN_WITH_GOOGLE;
    setTimeout(()=>{
      dispatch(toggleAuth())
    },2000)
  }
  return (
    <div>
      {isAuthenticated ? (
        <MyCalendar/>
      ): (
        <button onClick={loginWithGoogle}>Login with Google</button>
      )}

    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import { MyCalendar } from "./components/MyCalendar"
import axios from 'axios'
import { ACCESS, CREATE_USER, LOGIN_WITH_GOOGLE } from './utils/apiRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, setUserId, toggleAuth } from './feature/authSlice'
import { useGoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from 'react-hot-toast'
import { Login } from './components/Login'

function App() {
  const { isAuthenticated } = useSelector((store) => store.auth)
  const dispatch = useDispatch();
  const login = useGoogleLogin({
    onSuccess: async codeResponse => {
      console.log(codeResponse.access_token)
      dispatch(setToken(codeResponse.access_token));

      try {
        const {data} = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`, {
          headers :{
            Authorization: `Bearer ${codeResponse.access_token}`,
            Accept:'application/json'
          }
        });
        const r = await axios.post(CREATE_USER, {
          email:data.email,
          username:data.name,
          token:codeResponse.access_token
        })
        dispatch(toggleAuth());
        dispatch(setUserId(r.data.id))
      } catch (error) {
        console.log(error);
        toast.error("Somthing went wrong.")
      }
    }
  });

  return (
    <div>
      <Toaster/>
      {isAuthenticated ? (
        <MyCalendar />
      ) : (
        <Login login={login}/>
        // <button onClick={()=>login()}>Login with google</button>
      )}

    </div>
  )
}

export default App

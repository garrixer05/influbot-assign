import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isAuthenticated : false,
    token:"",
    userId:""
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        toggleAuth : (state)=>{
            state.isAuthenticated = !state.isAuthenticated
        },
        setToken: (state, action)=>{
            state.token = action.payload
        },
        setUserId:(state,action)=>{
            state.userId = action.payload
        }
    }
})

export const {toggleAuth,setToken,setUserId} = authSlice.actions;
export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isAuthenticated : true
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        toggleAuth : (state)=>{
            state.isAuthenticated = !state.isAuthenticated
        }
    }
})

export const {toggleAuth} = authSlice.actions;
export default authSlice.reducer;
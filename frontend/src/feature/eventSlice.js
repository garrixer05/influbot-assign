import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    events:[],
    isLoading:false
}

const eventSlice = createSlice({
    initialState,
    name:"myEvents",
    reducers:{
        setUserEvents : (state, actions)=>{
            state.events = actions.payload;
        }
    }
})

export const {setUserEvents}  = eventSlice.actions;
export default eventSlice.reducer;

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
        },
        addEvent : (state, action)=>{
            state.events.push(action.payload);
        },
        deleteEvent : (state, action)=>{
            let newEv = state.events.filter(ev=>action.payload!==ev.id);
            state.events = newEv;
        },
        updateEvent : (state, action)=>{
            let newEv = state.events.filter(ev=>action.payload.id!==ev.id);
            newEv.push(action.payload)
            state.events = newEv;
        }
    }
})

export const {setUserEvents, addEvent, updateEvent, deleteEvent}  = eventSlice.actions;
export default eventSlice.reducer;

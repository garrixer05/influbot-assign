import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isVisible : false,
    currEv : {}
}

const modalSlice = createSlice({
    name:"modal",
    initialState,
    reducers:{
        toggleModal : (state)=>{
            state.isVisible = !state.isVisible
        },
        closeModal : (state)=>{
            state.isVisible = false
        },
        showModal : (state, action)=>{
            state.isVisible=true;
            state.currEv=action.payload;
        }
    }
});

export const {toggleModal, closeModal, showModal} = modalSlice.actions;
export default modalSlice.reducer;
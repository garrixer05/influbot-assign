import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isVisible : false,
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
        }
    }
});

export const {toggleModal, closeModal} = modalSlice.actions;
export default modalSlice.reducer;
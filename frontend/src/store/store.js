import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../feature/modalSlice";
import authReducer from "../feature/authSlice"
import eventSlice from "../feature/eventSlice"
export const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth:authReducer,
    ev:eventSlice
  },
});
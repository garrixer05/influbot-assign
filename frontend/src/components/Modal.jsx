import { useState } from "react"
import '../styles/modal.css'
import { useDispatch, useSelector } from "react-redux"
import { closeModal } from "../feature/modalSlice"


export const Modal = ()=>{
    const dispatch = useDispatch();
    return (
        <div className="overlay">
            <div className="modal-content">
                <form action="">
                    <label htmlFor="">Name</label>
                    <input type="text" />
                </form>
                <button onClick={()=>dispatch(closeModal())}>Close</button>
            </div>
        </div>
    )
}

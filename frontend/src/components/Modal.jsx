import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { closeModal, toggleModal } from "../feature/modalSlice"
import { MdDeleteOutline } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { CREATE_EVENT, DELETE_EVENT, UPDATE_EVENT } from "../utils/apiRoutes";
import { addEvent, deleteEvent, updateEvent } from "../feature/eventSlice";
import Loader from "./Loader";

const getFDate = (s) => {
    let date = new Date(s);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    return currentDate
}
const getftime = (s) => {
    let t = s.split("T");
    return t[1]?.slice(0, 8);
}
const putTime = (s, d) => {
    s += ":00"
    const t = new Date(d.toDateString() + " " + s).toISOString();
    return t
}
export const Modal = () => {
    const { currEv } = useSelector(store => store.modal);
    const { token, userId } = useSelector(store => store.auth)
    const dispatch = useDispatch();
    const [isDisable, setIsDisable] = useState(true)
    const [ev, setEv] = useState(currEv.title ? { ...currEv } : {
        title: "",
        description: "",
        date: "",
        participants: [],
        startTime: "",
        endTime: ""
    });
    const [participant, setParticipant] = useState("");
    const [isLoading, setIsloading] = useState(false)
    const handleAddParticipant = (e) => {
        e.preventDefault()
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (participant.length) {
            if (!emailPattern.test(participant)) {
                toast.error("Enter a valid Email address");
                return
            }
        }
        if (ev.participants.length >= 5) {
            toast.error("Only add upto 5 participants");
            return;
        }
        setEv(prev => {
            let arr = [...prev.participants]
            arr.push(participant)
            return {
                ...prev,
                participants: arr
            }
        })
        setIsDisable(false);
        setParticipant("");
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update the form data
        setEv((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Set the modified flag to true
        setIsDisable(false);
    };
    const handleRemoveParticipant = (ind) => {
        setEv(prev => {
            let arr = [...prev.participants];
            arr.splice(ind, 1)
            return {
                ...prev,
                participants: arr
            }
        })
        setIsDisable(false);
    }
    const handleSave = async () => {
        setIsDisable(true);
        setIsloading(true);
        if (ev.id) {
            const newData = {
                ...ev
            }
            delete newData.id;
            delete newData.eventId
            delete newData.userId; delete newData.start; delete newData.end
            try {
                const res = await axios.put(UPDATE_EVENT, newData, {
                    params: {
                        id: ev?.id,
                        eventId: ev?.eventId,
                        token
                    }
                });
                if (res.status) {
                    dispatch((updateEvent(res.data.ev)))
                    toast.success("Event Updated!");
                }

            } catch (error) {
                if (error.status === 403) {
                    toast.error("Can't update event that is organized by other users.")
                }
            }
        } else {
            try {
                const res = await axios.post(CREATE_EVENT, { ...ev }, {
                    params: {
                        userId,
                        token
                    }
                });
                if (res.data.status) {
                    dispatch(addEvent(res.data.ev))
                    toast.success("Event created!");
                    setIsDisable(false);
                    setIsloading(false);
                } else {
                    toast.error("Event not saved. Something went wrong")
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    const handleDeleteEvent = async () => {
        setIsloading(true);
        setIsDisable(true);
        const is = window.confirm("Are you sure you want to delete this event?")
        if (is) {
            try {
                const res = await axios.delete(DELETE_EVENT, {
                    params: {
                        id: ev?.id,
                        eventId: ev?.eventId,
                        token
                    }
                });
                if (res.data.status) {
                    toast.success("Event Deleted")
                    dispatch(deleteEvent(ev?.id))
                    setIsloading(false);
                    setIsDisable(false)
                }else{
                    toast.error("Cannot delete event created by other Users")
                }
                dispatch(toggleModal())
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <div className="overlay">
            <Toaster />
            <div className="modal-content">

                <form className="mx-auto">
                    <div className="relative z-0 w-full mb-5 group">
                        <label htmlFor="">Event Title</label>
                        <input value={ev.title} onChange={e => handleInputChange(e)} type="text" name="title" className=" bg-gray-300 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <label htmlFor="">Event Date</label>
                        <input type="date" value={getFDate(ev.date)} onChange={e => { setEv({ ...ev, date: new Date(e.target.value) }); setIsDisable(false) }} name="event-date" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <label htmlFor="">Event Description</label>
                        <textarea type="text-area" value={ev.description} onChange={e => handleInputChange(e)} name="description" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="">Start time</label>
                            <input type="time" value={getftime(ev.startTime)} onChange={e => { setEv({ ...ev, startTime: putTime(e.target.value, new Date(getFDate(ev.date))) }); setIsDisable(false) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="">End time</label>

                            <input type="time" value={getftime(ev.endTime)} onChange={e => { setEv({ ...ev, endTime: putTime(e.target.value, new Date(getFDate(ev.date))) }); setIsDisable(false) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        </div>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <label htmlFor="">Participants</label>
                        <div>
                            {ev.participants.map((p, ind) => {
                                return (
                                    <div className="m-1 rounded-md text-white w-auto" key={ind}>
                                        <span className="bg-green-500 p-1 rounded-lg">{p} <span className=" font-semibold border bg-gray-200 rounded-lg"><button onClick={() => handleRemoveParticipant(ind)} className="px-3 text-red-500">x</button></span></span>
                                    </div>
                                )
                            })}
                        </div>
                        <div>
                            <input value={participant} onChange={e => setParticipant(e.target.value)} type="email" name="floating_company" id="floating_company" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <button onClick={e => handleAddParticipant(e)} disabled={participant.length === 0} className={participant.length === 0 ? "mt-1 text-white bg-gray-500 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-2.5 text-center cursor-not-allowed" : "mt-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-2.5 text-center"}>Add Participant</button>
                        </div>
                    </div>

                    <div className="flex flex-row">

                        <button onClick={handleSave} disabled={isDisable} type="submit" className={isDisable ? "text-white bg-gray-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center cursor-not-allowed" : "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"}>{isLoading ? (
                            <Loader size={21} color={"white"} speed={2.0} stroke={3} bgOpacity={""} />
                        ) : (

                            "Save"
                        )}</button>
                        <button className="ml-3 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" onClick={() => dispatch(closeModal())}>Close</button>
                        <div className="mt-2 ml-5">
                            <button onClick={handleDeleteEvent} className=""><MdDeleteOutline className="text-4xl text-red-500" /></button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}

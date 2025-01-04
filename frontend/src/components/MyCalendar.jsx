import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react';
import { Modal } from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { showModal, toggleModal } from '../feature/modalSlice';
import axios from 'axios';
import { GET_USER } from '../utils/apiRoutes';
import { setUserEvents, toggleState } from '../feature/eventSlice';
const localizer = momentLocalizer(moment)

export const MyCalendar = () => {
  const [key,setKey] = useState(0)
  const dispatch = useDispatch()
  const {isVisible} = useSelector((store)=>store.modal);
  const {userId} = useSelector(store=>store.auth);
  const {events} = useSelector(store=>store.ev);
  useEffect(()=>{
    const getUserEv = async ()=>{
      try {
        const {data} = await axios.get(GET_USER, {
          params:{
            id:userId
          }
        });
        dispatch(setUserEvents(data.User.events))
        setEvents(data.User.events.map(ev=>{
          return {
            ...ev,
            start:ev.startTime,
            end:ev.endTime,
          }
        }))
      } catch (error) {
        error
      }
    }
    getUserEv()
  },[key])

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      // console.log(start)
      dispatch(showModal({}))
      // if (title) {
      //   setEvents((prev) => [...prev, { start, end, title }])
      // }
    },
    []
  )
  const handleSelectEvent = useCallback(
    (event) => {
      dispatch(showModal(event));
    },
    []
  )

  return (

    <div>
      {
        isVisible && <Modal/>
      }
        
      <Calendar
        key={key}
        events={events.map(ev=>{
          return{
            ...ev,
            start:ev?.startTime,
            end:ev?.endTime,
          }
        })}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onSelecting={(i)=>handleSlot(i)}
        localizer={localizer}
        selectable
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
      <button onClick={()=>setKey(key+1)} className={"mt-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-2.5 text-center"}>Refresh</button>
    </div>
  )
}

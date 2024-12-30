import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react';
import { Modal } from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { showModal, toggleModal } from '../feature/modalSlice';
import axios from 'axios';
import { GET_USER } from '../utils/apiRoutes';
import { setUserEvents } from '../feature/eventSlice';
const localizer = momentLocalizer(moment)

export const MyCalendar = () => {
  const dispatch = useDispatch()
  const {isVisible} = useSelector((store)=>store.modal);
  const {userId} = useSelector(store=>store.auth);
  const {events} = useSelector(store=>store.ev);
  const [eventsFrom, setEvents] = useState(events.map(ev=>{
    return{
      ...ev,
      start:ev?.startTime,
      end:ev?.endTime,
    }
  }));
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
  },[])

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      // console.log(start)
      dispatch(showModal({}))
      // if (title) {
      //   setEvents((prev) => [...prev, { start, end, title }])
      // }
    },
    [setEvents]
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
        events={eventsFrom}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onSelecting={(i)=>handleSlot(i)}
        localizer={localizer}
        selectable
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  )
}

import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react';
import { Modal } from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '../feature/modalSlice';
import axios from 'axios';
import { GET_USER } from '../utils/apiRoutes';

const localizer = momentLocalizer(moment)

export const MyCalendar = () => {
  useEffect(()=>{
    const getUserEvents = async ()=>{
      const res = await axios.get(GET_USER);
      console.log(res.data)
    }
    getUserEvents()
  },[])
  const dispatch = useDispatch()
  const {isVisible} = useSelector((store)=>store.modal);
  const [myEvents, setEvents] = useState([])

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      dispatch(toggleModal())
      const title = window.prompt('New Event name')
      if (title) {
        setEvents((prev) => [...prev, { start, end, title }])
      }
    },
    [setEvents]
  )

  return (

    <div>
      {
        isVisible && <Modal/>
      }
        
      <Calendar
        events={myEvents}
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

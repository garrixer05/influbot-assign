import { createCalenderEvent, deleteCalenderEvent, getCalenderEvents, updateCalendarEvent } from "../Google/Calender.js";
import { getPrismaClient } from "../utils/getPrismaInstance.js";

const prisma = getPrismaClient();

// {
//     kind: 'calendar#event',
//     etag: '"3350953951900000"',
//     id: '2rvdf2t5ohq6jcuphhfk02of6m',
//     status: 'confirmed',
//     htmlLink: 'https://www.google.com/calendar/event?eid=MnJ2ZGYydDVvaHE2amN1cGhoZmswMm9mNm0gYWEyMDQ5NEBt',
//     created: '2022-02-28T05:10:35.000Z',
//     updated: '2023-02-04T02:16:15.950Z',
//     summary: 'R2 Interview with Ankit - Akhil',
//     description: 'Hi, \n' +
//       '\n' +
//       ' Setting up this meet for R2 Interview for the position CyberSecurity Jr Analyst.\n' +
//       '\n' +
//       'https://internshala.com/employer/application_detail/97511929?referral=employer_chat',
//     creator: { email: 'vcdandothkar@securdi.com' },
//     organizer: { email: 'vcdandothkar@securdi.com' },
//     start: { dateTime: '2022-02-28T06:40:00Z', timeZone: 'Asia/Kolkata' },
//     end: { dateTime: '2022-02-28T06:55:00Z', timeZone: 'Asia/Kolkata' },
//     iCalUID: '2rvdf2t5ohq6jcuphhfk02of6m@google.com',
//     sequence: 0,
//     attendees: [
//       {
//         email: 'aa20494@gmail.com',
//         self: true,
//         responseStatus: 'accepted'
//       }
//     ],
//     hangoutLink: 'https://meet.google.com/jgo-jkwy-weo',
//     conferenceData: {
//       entryPoints: [ [Object], [Object], [Object] ],
//       conferenceSolution: {
//         key: [Object],
//         name: 'Google Meet',
//         iconUri: 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png'
//       },
//       conferenceId: 'jgo-jkwy-weo'
//     },
//     guestsCanSeeOtherGuests: false,
//     reminders: { useDefault: true },
//     eventType: 'default'
// }

export const getUser = async (req, res)=>{
    try {
        const {id} = req.query
        const user = await prisma.user.findUnique({
            where:{
                id
            },
            include:{
                events:true
            }
        });
        return res.send({User:user});
    } catch (error) {
        console.log(error)
    }
}

export const failureRedirect = async (req, res)=>{
    try {
        return res.send("something went wrong")
        
    } catch (error) {
        console.log(error)
    }
}

export const createUser = async (req, res)=>{
    try {
        const {token} = req.query;
        const {username, email} = req.body;
        const id = await findOrCreate(username, email, token);
        return res.send({status:true, id, msg:"user created and synced with google calender"})
    } catch (error) {
        console.log(error)
    }
}

export const findOrCreate = async (userName, email, token)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            let events = await getCalenderEvents(token);
            let user = await prisma.user.create({
                data:{
                    email,
                    name:userName
                }
            });
            let processedEv = events.map((ev)=>{
                let participants = ev.attendees.map(p=>p.email)
                return {
                    userId: user.id,
                    eventId:ev.id,
                    title:ev.summary,
                    description:ev.description,
                    participants,
                    date:new Date(ev.start.dateTime),
                    startTime:new Date(ev.start.dateTime),
                    endTime:new Date(ev.end.dateTime)
                }
            });
            let count = await prisma.event.createMany({
                data:[
                    ...processedEv
                ],
            });
        }
        return user.id;
    
    } catch (error) {
        console.log(error)
    }
}

export const createEvent = async (req, res)=>{
    try {
        const {title, description, participants, date, startTime, endTime} = req.body;
        const {userId,token} = req.query;
        let rs = await createCalenderEvent(req.body, token)
        if(!rs){
            return res.send({status:false, msg:"Event creation failed"})
        }
        const ev = await prisma.event.create({
            data:{
                title,
                userId,
                eventId:rs.eventId,
                description,
                participants,
                date,
                startTime,
                endTime
            }
        });
        return res.send({status:true, ev, msg:"Event created"})
    } catch (error) {
        console.log(error)
    }
}

export const deleteEvent = async(req, res)=>{
    try {
        const {id, eventId, token} = req.query;
        const rs = await deleteCalenderEvent(eventId, token);
        if(!rs){
            return res.send({status:false, msg:"Event deletion failed"})
        }
        const ev = await prisma.event.delete({
            where:{
                id
            }
        });
        return res.send({status:true, msg:"Event deleted"})
    } catch (error) {
        console.log(error)
    }
}

export const updateEvent = async (req, res)=>{
    try {
        const {id, eventId,token} = req.query;
        const {title, description, participants, date, startTime, endTime} = req.body;
        const rs = await updateCalendarEvent(eventId, req.body, token);
        if(!rs.status){
            return res.sendStatus(rs?.code)
        }
        const ev = await prisma.event.update({
            where:{
                id
            },
            data:{
                ...req.body,
                eventId
            }
        });
        return res.send({status:true, ev, msg:"Event updated!"});
    } catch (error) {
        console.log(error)
    }
}
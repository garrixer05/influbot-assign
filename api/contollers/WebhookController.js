import { syncWithGCalendar } from "../Google/Calender.js";


export const gotNotified = async (req, res)=>{
    // console.log("route hit");
    // console.log(req.headers, res.headers);
    const stat = await syncWithGCalendar(req.headers.x-goog-resource-uri);
    return res.sendStatus(200)
}
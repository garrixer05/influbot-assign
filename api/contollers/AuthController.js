import dotenv from 'dotenv';

dotenv.config()

export const logoutUser = async (req, res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
    });
    req.logout((err)=>{
        console.log(err)
    })
    return res.send("User logged out")
}
export const success = async(req, res)=>{
    res.cookie("auth", true)
    return res.status(200).redirect(process.env.ORIGIN)
}

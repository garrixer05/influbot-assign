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
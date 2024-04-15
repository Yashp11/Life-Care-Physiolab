const isuserlogin = async (req,res,next)=>{

    if (!req.cookies.sessionID) {
        res.redirect('/loginvalidation');
    }
 next();
}

export default isuserlogin;
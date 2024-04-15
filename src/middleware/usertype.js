import User from '../models/user_model.js';
import Doctor from '../models/doctor_model.js';

const usertype= async(req,res,next)=>{
    
    let id = req.session.user.user_id;
    const user = await User.findOne({_id:id});
    const doctor = await Doctor.findOne({_id:id});
    if (user) {
        req.type = 'patient'
        req.user = user;
    }else if (doctor) {
        req.type='doctor';
        req.user=doctor;
    }else{
      return res.send('<script>alert("Type Not Found");</script>'); 
    }
    next();
}
export default usertype;


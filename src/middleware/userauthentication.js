import User from '../models/user_model.js';
import Doctor from '../models/doctor_model.js';

const userauthentication = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const user = await User.findOne({email : email});
        const doctor = await Doctor.findOne({email : email});
    
        if (user || doctor) {
            return res.send('<script>alert("User already exists"); window.location.href = "/signup";</script>'); 
        }
        if (req.body.password !=req.body.conform_password) {
            return res.send('<script>alert("Password is not matched with Conform password"); window.location.href = "/signup";</script>')
        }
        next();
    } catch (error) {
        console.log(error);
    }
}
export default userauthentication;
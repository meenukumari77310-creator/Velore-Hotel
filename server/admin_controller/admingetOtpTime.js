import Admin from '../models/admin.js'

export const AdmingetOtpTime = async (req,res,next)=>{
    const {token} = req.body
    if (!token) {
  const error = new Error("Token is required");
  error.statusCode = 400;
  throw error;
}


    try {
        const findUser = await Admin.findOne({'otp.token': token}).select('otp')

        if(!findUser){
            const error = new Error("Something went wrong.")
            error.statusCode = 400
            throw error
        }
        res
        .status(200)
        .json({
            message: 'success', 
            status: true, 
            sendTime: findUser.otp.sendTime,
        });


    } catch (error) {
        next(error)
    }

}
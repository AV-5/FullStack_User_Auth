const healthcheck_controller=async(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Health check successful"
    })
}
export default healthcheck_controller;
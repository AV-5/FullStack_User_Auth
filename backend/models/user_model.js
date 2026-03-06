import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema=new mongoose.Schema({
    name:{
        type :String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
},
{
    timestamps:true
});
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return;
    }
    this.password=await bcrypt.hash(this.password,10);
    
});
export default mongoose.model("User",userSchema);
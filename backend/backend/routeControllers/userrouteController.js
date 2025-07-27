import User from "../models/userModels.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwtToken.js"; // Assuming jwtToken is defined in utils

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(500).send({ success: false, message: "Username or email already exists" });
        }

        const hashPassword = bcryptjs.hashSync(password, 10);

        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilepic: gender === "male" ? profileBoy : profileGirl
        });

        if (newUser) {
            await newUser.save();
            jwtToken(newUser._id, res); // Assuming jwtToken is defined elsewhere
            console.log("User saved:", newUser);
        } else {
            return res.status(500).send({ success: false, message: "User registration failed" });
        }

        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};
           export const userLogin=async(req,res)=>{
            try {
                const{email,password}=req.body;
                const user=await User.findOne({email});
                if(!user){
                    return res.status(500).send({success:false,message:"User not found"});
                }
                const comparePasss=bcryptjs.compareSync(password,user.password || "");
                if(!comparePasss){
                    return res.status(500).send({success:false,message:"Invalid password"});
                }
                jwtToken(user._id,res); // Assuming jwtToken is defined elsewhere
                res.status(200).send({
                        _id:user._id,
                        fullname:user.fullname,
                        username:user.username,
                        email:user.email,
                        profilepic:user.profilepic,
                        message:"Login successful"
                });
                
            } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message || "Something went wrong"
                
            })
             console.log(error);

           }
        }
export const userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.SECURE !== "development",
  expires: new Date(0)
});


    res.status(200).send({
      message: "Logout successful"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};

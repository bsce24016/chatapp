import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).send({ success: false, message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error(`Error in isLogin middleware: ${error.message}`);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

export default isLogin;

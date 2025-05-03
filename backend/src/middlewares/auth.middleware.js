import jwt from "jsonwebtoken";
import {db} from "../libs/db.js";
export const authMiddleware = async (req, res, next) => {
    try {
      console.log("Headers:", req.headers);
  
      // Manually parse cookies
      const rawCookies = req.headers.cookie;
      let token;
  
      if (rawCookies) {
        const parsedCookies = Object.fromEntries(
          rawCookies.split(';').map(cookie => {
            const [name, ...rest] = cookie.trim().split('=');
            return [name, decodeURIComponent(rest.join('='))];
          })
        );
        token = parsedCookies.token;
      }
  
      // Fallback to Authorization header
      token = token || req.headers.authorization?.split(" ")[1];
  
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
  
      const user = await db.user.findUnique({
        where: {
          id: req.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        }
      });
  
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in authMiddleware:", error);
      return res.status(500).json({ message: "Token verification failed" });
    }
  };
  

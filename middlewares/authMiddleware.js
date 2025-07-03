import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        message: "No token provided",
        success: false,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Invalid token",
          success: false,
        });
      }

      req.body.role = decoded.myRole;
      req.body.userId = decoded.id;
      next();
    });
  } catch (error) {
    return res.status(401).send({
      message: "Auth failed",
      success: false,
    });
  }
};

export default authMiddleware;

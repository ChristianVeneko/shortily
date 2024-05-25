import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  // Verificar si se proporcionó un token en el encabezado de autorización
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded; // Adjuntar el usuario decodificado al objeto de solicitud
    next(); // Llamar a la siguiente función de middleware
  } catch (error) {
    res.status(401).json({ success: false, message: token });
  }
};

export default authMiddleware;

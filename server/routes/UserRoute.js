import { register, login, setAvatar, getAllUser } from "../controllers/UserController";
import express from "express";

const userRoute = express.Router();
userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/set-avatar/:id", setAvatar);
userRoute.get("/all-users/:id", getAllUser);
export default userRoute;
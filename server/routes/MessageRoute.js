import { addMessage, getAllMessage } from "../controllers/MessageController";
import express from "express";

const messageRoute = express.Router();
messageRoute.post("/add-message", addMessage);
messageRoute.post("/get-all-messages", getAllMessage);
export default messageRoute;
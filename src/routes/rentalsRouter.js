import { Router } from "express";
import { getRentals, postRentals } from "../controllers/rentalsController.js";

const rentalsRouter = Router();
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRentals);

export default rentalsRouter;

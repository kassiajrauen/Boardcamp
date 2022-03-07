import { Router } from "express";
import {
  getRentals,
  postRentals,
  finishRentals,
  deleteRentals,
} from "../controllers/rentalsController.js";
import {
  validateRentals,
  validateRentalsId,
} from "../middlewares/validateRentalsMiddleware.js";

const rentalsRouter = Router();
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRentals, postRentals);
rentalsRouter.post("/rentals/:id/return", validateRentalsId, finishRentals);
rentalsRouter.delete("/rentals/:id", validateRentalsId, deleteRentals);

export default rentalsRouter;

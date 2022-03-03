import { Router } from "express";
import {
  getCustomers,
  postCustomers,
} from "../controllers/customersController.js";

const customersRouter = Router();
customersRouter.get("/customers", getCustomers);
customersRouter.post("/customers", postCustomers);

export default customersRouter;

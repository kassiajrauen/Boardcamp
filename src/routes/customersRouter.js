import { Router } from "express";
import {
  getCustomers,
  postCustomers,
  getCustomersId,
  updateCustomers,
} from "../controllers/customersController.js";
import { validateCustomers } from "../middlewares/validateCustomersMiddleware.js";

const customersRouter = Router();
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersId);
customersRouter.post("/customers", validateCustomers, postCustomers);
customersRouter.put("/customers/:id", validateCustomers, updateCustomers);

export default customersRouter;

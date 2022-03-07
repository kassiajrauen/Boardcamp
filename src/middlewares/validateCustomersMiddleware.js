import connection from "../database.js";
import customersSchema from "../schemas/customersSchemas.js";

export async function validateCustomers(req, res, next) {
  const validation = customersSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(422);
  }

  const { name, cpf } = req.body;

  if (name === " ") {
    return res.sendStatus(400);
  }

  try {
    const exist = await connection.query(
      `
        SELECT cpf FROM customers WHERE cpf=$1
      `,
      [cpf]
    );

    if (exist.rowCount > 0) {
      return res.sendStatus(409);
    }
    next();
  } catch (error) {
    res.sendStatus(500);
  }
}

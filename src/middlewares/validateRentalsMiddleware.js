import connection from "../database.js";
import rentalsSchemas from "../schemas/rentalsSchemas.js";

export async function validateRentals(req, res, next) {
  const validation = rentalsSchemas.validate(req.body);

  if (validation.error) {
    return res.sendStatus(422);
  }

  const { customerId, gameId, daysRented } = req.body;

  if (parseInt(daysRented) <= 0) {
    return res.sendStatus(400);
  }

  try {
    const game = await connection.query(
      `
      SELECT games."stockTotal" FROM games WHERE id=$1
    `,
      [gameId]
    );

    const customer = await connection.query(
      `
      SELECT * FROM customers WHERE id=$1
    `,
      [customerId]
    );

    if (game.rowCount === 0 || customer.rowCount === 0) {
      return res.sendStatus(400);
    }

    const isAvailable = await connection.query(
      `
      SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" is null
    `,
      [gameId]
    );

    const stockTotal = game.rows[0].stockTotal;

    if (stockTotal - isAvailable.rowCount === 0) {
      return res.sendStatus(400);
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function validateRentalsId(req, res, next) {
  const { id } = req.params;

  try {
    const exist = await connection.query(
      `
    SELECT * FROM rentals 
    WHERE id=$1
  `,
      [id]
    );

    if (exist.rows.length === 0) {
      res.sendStatus(404);
    }

    if (exist.rows[0].returnDate !== null) {
      res.sendStatus(400);
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

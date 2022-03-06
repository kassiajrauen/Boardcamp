import connection from "../database.js";
import gamesSchemas from "../schemas/gamesSchemas.js";

export async function validateGames(req, res, next) {
  const validation = gamesSchemas.validate(req.body);

  if (validation.error) {
    return res.sendStatus(422);
  }

  const { name, stockTotal, categoryId, pricePerDay } = req.body;

  if (name === " " || parseInt(stockTotal) <= 0 || parseInt(pricePerDay) <= 0) {
    return res.sendStatus(400);
  }

  try {
    const categories = await connection.query(
      `
      SELECT id FROM categories WHERE id=$1
      `,
      [categoryId]
    );
    const exist = await connection.query(
      `
        SELECT id FROM games WHERE name=$1
        `,
      [name]
    );

    if (categories.rowCount === 0) {
      return res.sendStatus(400);
    }

    if (exist.rowCount > 0) {
      return res.sendStatus(409);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

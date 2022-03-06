import connection from "../database.js";

export async function validateCategories(req, res, next) {
  const { name } = req.body;

  if (!name) {
    return res.sendStatus(400);
  }

  try {
    const exist = await connection.query(
      `
        SELECT id FROM categories WHERE name=$1
        `,
      [name]
    );

    if (exist.rowCount > 0) {
      return res.sendStatus(409);
    }
    next();
  } catch (error) {
    res.sendStatus(500);
  }
}

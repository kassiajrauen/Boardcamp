import connection from "../database.js";

export async function getGames(req, res) {
  const name = req.query.name;

  try {
    if (!name) {
      const result = await connection.query(`
        SELECT games.*, categories.name AS "categoryName" FROM games 
          JOIN categories 
            ON games."categoryId" = categories.id
      `);
      return res.send(result.rows);
    } else {
      const resultCaseIns = await connection.query(
        `
        SELECT games.*, categories.name AS "categoryName" FROM games 
        JOIN categories ON games."categoryId"=categories.id
        WHERE LOWER(games.name) LIKE LOWER($1) 
      `,
        [`${name}%`]
      );
      res.send(resultCaseIns.rows);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function postGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    await connection.query(
      `
      INSERT INTO 
        games (name, image, "stockTotal", "categoryId", "pricePerDay") 
          VALUES ($1, $2, $3, $4, $5)
    `,
      [name, image, parseInt(stockTotal), categoryId, parseInt(pricePerDay)]
    );
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

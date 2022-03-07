import connection from "../database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;

  try {
    const rentals = await connection.query(`
    SELECT rentals.*, 
      customers.id AS "customerId", 
      customers.name AS "customerName",
      games.id AS "gameId",
      games.name AS "gameName", games."categoryId",
      categories.name AS "categoryName",
      categories.id AS "categoryId"
      FROM rentals
        JOIN customers ON customers.id=rentals."customerId"
        JOIN games ON games.id=rentals."gameId"
        JOIN categories ON categories.id=games."categoryId"
        ${customerId ? `WHERE customers.id = ${parseInt(customerId)}` : ""}
        ${gameId ? `WHERE games.id = ${parseInt(gameId)}` : ""}
`);

    const rentalResult = rentals.rows.map((rental) => {
      const entry = {
        ...rental,
        rentDate: dayjs(rental.rentDate).format("YYYY-MM-DD"),
        customer: {
          id: rental.customerId,
          name: rental.customerName,
        },
        game: {
          id: rental.gameId,
          name: rental.gameName,
          categoryId: rental.categoryId,
          categoryName: rental.categoryName,
        },
      };

      delete entry.customerName;
      delete entry.categoryId;
      delete entry.categoryName;
      delete entry.gameName;

      return entry;
    });

    res.send(rentalResult);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const rentDate = dayjs().format("YYYY-MM-DD HH:mm");
  const returnDate = null;
  const delayFee = null;

  try {
    const pricePerDay = await connection.query(
      `
    SELECT games."pricePerDay" FROM games
    WHERE id=$1
   `,
      [gameId]
    );
    const originalPrice = pricePerDay.rows[0].pricePerDay * daysRented;

    await connection.query(
      `
    INSERT INTO 
      rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
   `,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function finishRentals(req, res) {
  const { id } = req.params;
  const returnDate = dayjs().format("YYYY-MM-DD HH:mm");

  try {
    const result = await connection.query(
      `
      SELECT rentals.*, games."pricePerDay" AS "pricePerDay" 
      FROM rentals
      JOIN games ON games.id-rentals."gameId"
      WHERE rentals.id=$1
    `,
      [id]
    );

    const delayDays = dayjs().diff(result.rows[0], "days");

    const delayFee =
      delayDays > 0 ? parseInt(delayDays) * result.rows[0].pricePerDay : 0;

    await connection.query(
      `
      UPDATE rentals SET "returnDate"=$1, "delayFee"=$2
      WHERE id=$3
    `,
      [returnDate, delayFee, id]
    );

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function deleteRentals(req, res) {
  const { id } = req.params;

  try {
    await connection.query(
      `
      DELETE FROM rentals
      WHERE id=$1
    `,
      [id]
    );

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}

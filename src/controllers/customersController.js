import connection from "../database.js";
import dayjs from "dayjs";

export async function getCustomers(req, res) {
  const cpf = req.query.cpf;

  try {
    if (!cpf) {
      const result = await connection.query(`
        SELECT * FROM customers
      `);
      const resultFormatted = result.rows.map((result) => ({
        ...result,
        birthday: dayjs(result.birthday).format("YYYY-MM-DD"),
      }));

      return res.send(resultFormatted);
    } else {
      const resultCpf = await connection.query(
        `
        SELECT * FROM customers WHERE (cpf) LIKE($1)
      `,
        [`${cpf}%`]
      );
      if (resultCpf) {
        const resultCpfFormatted = resultCpf.rows.map((resultCpf) => ({
          ...resultCpf,
          birthday: dayjs(resultCpf.birthday).format("YYYY-MM-DD"),
        }));

        res.send(resultCpfFormatted);
      } else {
        return res.sendStatus(404);
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function postCustomers(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await connection.query(
      `
      INSERT INTO 
        customers (name, phone, cpf, birthday) 
          VALUES ($1, $2, $3, $4)
    `,
      [name, phone, cpf, birthday]
    );
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function getCustomersId(req, res) {
  const { id } = req.params;

  try {
    const result = await connection.query(
      `
      SELECT * FROM customers WHERE id=$1
    `,
      [id]
    );

    if (result.rowCount > 0) {
      const resultId = {
        ...result.rows[0],
        birthday: dayjs(result.rows[0].birthday).format("YYYY-MM-DD"),
      };
      res.send(resultId);
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function updateCustomers(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  try {
    await connection.query(
      `
      UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4
      WHERE customers.id=$5
      `,
      [name, phone, cpf, dayjs(birthday).format("YYYY-MM-DD"), id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

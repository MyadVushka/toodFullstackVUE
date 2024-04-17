const express = require("express");
const {Client} = require("pg");
const cors = require("cors");

const app = express();

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "todoList",
  password: "1991",
  port: 5432,
})

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

app
  .route("/entries")
  .get((req, res) => {
    client.query("SELECT * FROM todos", (err, result) => {
      res.send(result.rows);
    })
  })
  .post((req, res) => {
    res.sendStatus(200);

    const text = req.body.text;
    client.query(`INSERT INTO todos (todo_text, is_completed) VALUES ('${text}', FALSE)`);
  });

app.delete("/deleteAll", (req, res) => {
  res.sendStatus(203);
  client.query(`DELETE FROM todos`);
});

app.delete("/deleteId", (req, res) => {
  res.sendStatus(203);

  client.query(`DELETE FROM todos WHERE id = ${req.body.id}`);
});

app.put('/updateId', (req, res) => {
  res.sendStatus(203);
  const state_in_process = req.body.state_in_process;

  if (state_in_process) {
    client.query(`UPDATE todos SET is_completed = FALSE WHERE id = '${req.body.id}'`)
  }
  else {
    client.query(`UPDATE todos SET is_completed = TRUE WHERE id = '${req.body.id}'`)
  }
})

app.listen(3000, (err) => {
  if (err) throw err;

  console.log("Server started");
});

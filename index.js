const express = require("express");
const cors = require("cors");

const { connection } = require("./config/db.js");
const { apiRouter } = require("./routes/api.routes.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.get("/", async (req, res) => {
  try {
    res.status(200).send({ msg: `Welcome to Social Media App Backend` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(8000, async () => {
  try {
    await connection;
  } catch (error) {
    console.log(error);
  }
  console.log("connected to db and port 8000");
});

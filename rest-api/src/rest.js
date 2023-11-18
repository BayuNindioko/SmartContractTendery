const { createAnswer, getAnswer, getAllAnswers, isReady } =
  require("./blockchain")();
const { res_api_port } = require("../config.json");
const express = require("express");
const app = express();

app.use(express.json());
app.get("/", (_, res) => {
  try {
    res.status(200).send(`hello world, random number: ${Math.random()}`);
  } catch (err) {
    res.status(400).send(`found error: ${err}`);
  }
});

app.post("/", async (req, res) => {
  try {
    const { body } = req;
    const { method, params } = body;

    if (method == "createAnswer") {
      // [privateKeyOrStr, kodePertanyaan, answer] = params;
      const resInteract = await createAnswer(...params);
      res.status(200).json(resInteract);
    }

    if (method == "getAnswer") {
      // [privateKeyOrStr, index] = params;
      const resInteract = await getAnswer(...params);
      res.status(200).json(resInteract);
    }

    if (method == "getAllAnswer") {
      // [privateKeyOrStr] = params;
      const resInteract = await getAllAnswers(...params);
      res.status(200).json(resInteract);
    }
  } catch (err) {}
});

app.listen(res_api_port, () => {
  console.log(`INFO: rest api listening on port: ${res_api_port}`);
  isReady();
});

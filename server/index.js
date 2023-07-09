import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Import node-fetch

const app = express();

app.use(cors());

app.get("/", async (req, res) => {
    const word = req.query.q
  try {
    const response = await fetch(
      `https://en.wiktionary.org/w/api.php?action=query&format=json&prop=extracts&titles=${word}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});

app.listen(3001, () => {
  console.log("Welcome to the server");
});

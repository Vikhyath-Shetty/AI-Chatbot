const express = require("express");
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { marked } = require("marked");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

//fetching respose from api
const getResponse = asyncHandler(async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const { prompt } = req.body;
  const result = await model.generateContent(prompt);
  if (!result) {
    res.status(500).json({ message: "Sorry,Try again!" });
  }
  const message = marked(result.response.text());
  res.status(200).json({ message: message });
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});

app.use(cors());
app.use(express.json());
app.post("/api/prompt", getResponse);

import cors from "cors";
import express from "express";
import { config } from "dotenv";
import aiRouter from "./routes/ai.routes";

const PORT = 4321;
const app = express();
config();

app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.use("/ai", aiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost: ${PORT}`);
});

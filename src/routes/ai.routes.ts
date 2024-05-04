import { Request, Response, Router } from "express";
import fs from "fs";
import multer from "multer";
import pdfParse from "pdf-parse";
import { sendToOpenAI } from "../services/openAI.service";
import { summarizeText } from "../utils/summarizeText";
import { generatePrompt } from "../utils/prompt";

const router = Router();
const upload = multer({ dest: "uploads/" });

interface CandidateEvaluation {
  experience_score: number;
  education_score: number;
  skills_score: number;
  language_score: number;
  compatibility_score: number;
  seniority_level: string;
  soft_skills: string[];
  hard_skills: string[];
}

interface CandidateProfile {
  filename: string;
  evaluation: CandidateEvaluation;
}

interface ApiResponse {
  response: string; // Esto es lo que recibes, la cadena JSON embebida.
}

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const AIResponse = await sendToOpenAI(prompt);

    res.json({ response: AIResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/upload-cv",
  upload.fields([
    { name: "pdfs", maxCount: 50 },
    { name: "position", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const { pdfs, position } = req.files as {
        pdfs: Express.Multer.File[];
        position: Express.Multer.File[];
      };

      if (!position || !pdfs) {
        return res
          .status(400)
          .send("Falta el archivo de la vacante o los archivos PDF.");
      }

      const vacanteText = fs.readFileSync(position[0].path, "utf-8");

      const summaries = [];

      for (const pdf of pdfs) {
        const dataBuffer = fs.readFileSync(pdf.path);
        const pdfText = await pdfParse(dataBuffer);

        const summary = summarizeText(pdfText.text);
        summaries.push({ filename: pdf.originalname, summary });
      }

      const promptText = await generatePrompt(
        vacanteText,
        JSON.stringify(summaries)
      );
      if (!promptText) {
        return res
          .status(500)
          .send("Ocurrió un error al procesar los archivos PDF.");
      }

      const jsonData = await sendToOpenAI(JSON.stringify(promptText));

      res.json({
        response: JSON.parse(jsonData),
      });
    } catch (error: any) {
      console.error({ error });
      res.status(500).send({
        error: error.message,
      });
    }
  }
);
export default router;

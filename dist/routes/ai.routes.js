"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const openAI_service_1 = require("../services/openAI.service");
const summarizeText_1 = require("../utils/summarizeText");
const prompt_1 = require("../utils/prompt");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt } = req.body;
        const AIResponse = yield (0, openAI_service_1.sendToOpenAI)(prompt);
        res.json({ response: AIResponse });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.post("/upload-cv", upload.fields([
    { name: "pdfs", maxCount: 50 },
    { name: "position", maxCount: 1 },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pdfs, position } = req.files;
        if (!position || !pdfs) {
            return res
                .status(400)
                .send("Falta el archivo de la vacante o los archivos PDF.");
        }
        const vacanteText = fs_1.default.readFileSync(position[0].path, "utf-8");
        const summaries = [];
        for (const pdf of pdfs) {
            const dataBuffer = fs_1.default.readFileSync(pdf.path);
            const pdfText = yield (0, pdf_parse_1.default)(dataBuffer);
            const summary = (0, summarizeText_1.summarizeText)(pdfText.text);
            summaries.push({ filename: pdf.originalname, summary });
        }
        const promptText = yield (0, prompt_1.generatePrompt)(vacanteText, JSON.stringify(summaries));
        if (!promptText) {
            return res
                .status(500)
                .send("Ocurrió un error al procesar los archivos PDF.");
        }
        const jsonData = yield (0, openAI_service_1.sendToOpenAI)(JSON.stringify(promptText));
        res.json({
            response: JSON.parse(jsonData),
        });
    }
    catch (error) {
        console.error({ error });
        res.status(500).send({
            error: error.message,
        });
    }
}));
exports.default = router;

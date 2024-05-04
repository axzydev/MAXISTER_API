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
exports.sendToOpenAI = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../utils/config");
const sendToOpenAI = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    try {
        const response = yield (0, node_fetch_1.default)(OPENAI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${(0, config_1.getConfig)("OPENAI_API_KEY")}`,
            },
            body: prompt,
        });
        if (!response.ok) {
            const errorData = yield response.text();
            throw new Error(`Error from OpenAI: ${response.status} ${errorData}`);
        }
        const data = yield response.json();
        console.log(data.choices[0].message);
        return data.choices[0].message.content;
    }
    catch (error) {
        console.error("Failed to send data to OpenAI:", error);
        throw new Error("Failed to communicate with OpenAI API");
    }
});
exports.sendToOpenAI = sendToOpenAI;

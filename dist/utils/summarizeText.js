"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeText = void 0;
const summarizeText = (text, maxLength = 10000) => {
    const cleanedText = text.replace(/[\n\r\t]/g, " ").replace(/[^\w\s]/gi, "");
    const sentences = cleanedText.split(".").map((sentence) => sentence.trim());
    const validSentences = sentences.filter((sentence) => sentence.length > 0);
    let summary = "";
    let lengthCount = 0;
    for (const sentence of validSentences) {
        if (lengthCount + sentence.length <= maxLength) {
            summary += sentence + ". ";
            lengthCount += sentence.length;
        }
        else {
            break;
        }
    }
    return summary.trim();
};
exports.summarizeText = summarizeText;

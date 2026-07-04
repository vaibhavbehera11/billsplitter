const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);


async function parseBillImage(imageBuffer, mimeType) {
  const model =
    genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });


  const prompt = `
You are a bill parsing assistant.

Extract only food or bill items from this receipt image.

Return ONLY valid JSON.

Format:
[
  {
    "name": "item name",
    "price": number,
    "quantity": number
  }
]

Rules:
- Do not include explanations.
- Do not include markdown.
- If quantity is missing, use 1.
- Prices must be numbers.
`;


  const imagePart = {
    inlineData: {
      data:
        imageBuffer.toString("base64"),

      mimeType,
    },
  };


  const result =
    await model.generateContent([
      prompt,
      imagePart,
    ]);


  const response =
    result.response.text();


  const cleanedResponse =
    response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();


  return JSON.parse(cleanedResponse);
}


module.exports = {
  parseBillImage,
};
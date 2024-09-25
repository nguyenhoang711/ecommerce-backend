import { GoogleGenerativeAI } from "@google/generative-ai"
const {gemini: {api_key, model}} = require('./config')

const genAI = new GoogleGenerativeAI(api_key)
const schema = {
  description: "List of recommend products",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      productName: {
        type: SchemaType.STRING,
        description: "Name of the product",
        nullable: false,
      },
    },
    required: ["productName"],
  },
}

const modelC = genAI.getGenerativeModel({
    model: model || "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
    },
});


module.exports = modelC
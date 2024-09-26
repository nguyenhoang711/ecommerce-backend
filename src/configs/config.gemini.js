const { GoogleGenerativeAI } = require("@google/generative-ai")
const {gemini: {api_key, model}} = require('./config')

const genAI = new GoogleGenerativeAI(api_key)
// const schema = {
//   description:
//     "Đưa tôi 5 gợi ý sản phẩm tương tự.",
//   type: "array",
//   products: {
//     description: "sản phẩm gợi ý.",
//     type: "object",
//     properties: {
//       product_name: {
//         description: "tên sản phẩm.",
//         type: "string",
//       },
//       product_attributes: {
//         description: "thuộc tính sản phẩm.",
//         type: "object",
//         properties: {
//           brand: {
//             description: "Thương hiệu sản phẩm.",
//             type: "string",
//           },
//           size: {
//             description:
//               "Kích thước sản phẩm.",
//             type: "string",
//           },
//           material: {
//             description:
//               "Chất liệu sản phẩm",
//             type: "string",
//           },
//           required: ["material", "brand", "size"],
//         }
//       },
//       product_ratingsAverage: {
//         description: "trung bình đánh giá sản phẩm.",
//         type: "number",
//       },
//     },
//     required: ["product_name", "product_attributes", "product_ratingsAverage"],
//   },
// }

const modelC = genAI.getGenerativeModel({
    model: model || "gemini-1.5-flash",
});


module.exports = {
    modelC
}
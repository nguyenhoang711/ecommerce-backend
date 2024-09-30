const { Api400Error } = require("../core/error.response")
const { modelC } = require('../configs/config.gemini')
const { chat } = require('../models/chat.model')
const { queryUser } = require("../models/repositories/chat.repo")
async function runChat(userInput) {
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    }

    const chat = modelC.startChat({
        generationConfig,
        history: [
            {
              role: "user",
              parts: [
                {text: "Bạn là chuyên viên bán hàng của Attex Shop. Attex Shop là website bán sản phẩm thời trang và phụ kiện thời trang. Nhiệm vụ của bạn là thu thập tài khoản email người dùng. Bạn sẽ không trả lời câu hỏi nào cho đến khi người dùng cung cấp đúng thông tin tài khoản email. Hãy yêu cầu người dùng cung cấp email. Sau khi được cung cấp email đúng định dạng,cảm ơn và trả về thông tin email người dùng dưới dạng {{email: [tài khoản email người dùng]}}. Sau đó bạn có thể hỏi có thể giúp đỡ tư vấn sản phẩm gì cho khách hàng hoặc cung cấp thông tin về Attex Shop:\nAttex Shop's website bán đồ thời trang Online nằm trong top 10 doanh nghiệp có doanh số ổn định trong nhiều năm\nMột Startup ứng dụng công nghệ để thay đổi ngành thời trang truyền thống theo hướng D2C Online, mang lại sự tiện lợi và tiết kiệm hơn cho các đấng mày râu?\nMột Thương Hiệu đồ thời trang hướng tới các sản phẩm tối giản, tập trung vào chất liệu và sự bền vững: Substainable Fashion?\nMột Startup lên SharkTank gọi được 500k USD trong thời gian nhanh nhất, nhưng cũng có màn ‘kỳ kèo’ gay cấn nhất?\nMột công ty đã vượt qua giai đoạn đại dịch Covid, và đạt tốc độ tăng trưởng 3.5 lần so với năm 2020?\nMột doanh nghiệp bán hàng Online đầu tiên tại Việt Nam có chính sách kỳ quặc: cho phép khách hàng đổi trả sản phẩm tới 60 ngày kể cả đã qua sử dụng?\nMột \"Zappos\" của Việt Nam khi đứng ra cam kết hài lòng 100% cho khách hàng mua sắm Online bằng 11 điều cụ thể?\nMột Startup nguồn lực hạn chế đã có chương trình Care&Share đóng góp cho hoạt động từ thiện ý nghĩa?\nMột Startup mới 3 năm tuổi còn gặp nhiều khó khăn mà đi xây dựng Văn Hóa Doanh Nghiệp?\nVăn hoá Attex Shop\nỞ Attex Shop, văn hóa không chỉ là một bộ tài liệu, mà đó là \"cẩm nang\" và \"quy tắc ứng xử\" cho tất cả nhân viên của Attex Shop bất kể ai, và bất kể vị trí gì. Attex Shop coi việc xây dựng Văn Hóa là một phần quan trọng trong việc xây dựng doanh nghiệp phát triển mạnh và bền vững. 10 điều về Văn Hóa Attex Shop được coi là \"bộ luật Attex Shop\" định hướng cho mọi hành vi và tính cách của con người Attex Shop."},
              ],
            },
            {
              role: "model",
              parts: [
                {text: "Xin chào! Rất vui được gặp bạn! 👋\n\nTrước khi chúng ta bắt đầu, cho mình xin phép hỏi địa chỉ email của bạn để tiện liên lạc và gửi thông tin ưu đãi nhé! 📧\n"},
              ],
            },
          ],
    })
    const result = await chat.sendMessage(userInput)
    const response = result.response.text()
    return response
}

class MessageService {
    static pushMessage = async (
        payload
    ) => {
        try {
            const userInput = payload.message.value
            await chat.create({
                from: payload.from,
                to: payload.to,
                message: {
                    type: 'text',
                    value: userInput
                }
            })
            console.log("Incoming / chat req: ", userInput)
            if(!userInput) throw new Api400Error("Invalid message")
            
            const response = await runChat(userInput)

            return await chat.create({
                from: payload.to,
                to: payload.from,
                message: {
                    type: 'text',
                    value: response
                }
            }); 
        } catch (e) {
            console.error(e)
        }
    }

    static getAllMessages = async (
        payload
    ) => {
        try {    
            const { from } = payload;
            if(!from) throw new Api400Error('Lack of sender and receiver info')
            const query = {$or: [{from: from}, {to: from}]}
            const messages = await queryUser({query})
            return messages
        } catch (e) {
            console.error(e)
        }
    }
}

module.exports = {
    MessageService
}

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const explainFortune = async (
  module: string,
  userName: string,
  userBirthday: string,
  fortuneRank: string,
  fortunePoem: string,
  fortuneMeaning: string
): Promise<string> => {
  try {
    const prompt = `
你是一位精通中国传统易经八卦和解签的大师。
现在有一位名为【${userName}】（出生日期：【${userBirthday}】）的用户正在求签，他求签的目的是为了预测【${module}】（例如：考研上岸、省考上岸、事业编上岸）。
他抽到的签是：
签文等级：【${fortuneRank}】
签文诗句：【${fortunePoem}】
签文原意：【${fortuneMeaning}】

请你结合他求签的目的【${module}】以及他的生辰信息，用通俗易懂、富有哲理、且带有鼓励性质的语言，为他详细解签。
解签内容需要包含：
1. 对签文诗句的深度解析。
2. 结合【${module}】的具体情况，给出备考或心态上的建议。
3. 最后的祝福语。

请直接输出解签内容，不需要多余的寒暄。排版要清晰，可以使用换行和简单的符号分隔。
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "解签失败，请稍后再试。";
  } catch (error) {
    console.error("Error explaining fortune:", error);
    return "解签服务暂时不可用，请稍后再试。";
  }
};

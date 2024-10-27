// 모듈 가져오기
import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// 환경 변수
dotenv.config();

// 서버 설정
const app = express();

// CORS 설정
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // OPTIONS 요청 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// JSON 파싱
app.use(express.json());

// OpenAI 클라이언트
const openai = new OpenAI({
    apiKey: process.env.KEY_OPENAI
});

// 시스템 메시지
const SYSTEM_MESSAGE = "당신은 goUP AI이며 사용자의 AI 비서입니다.";

// GPT 4o Mini
app.post('/api/message/gpt', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400)
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini-2024-07-18",
            messages: [
                { role: "system", content: SYSTEM_MESSAGE },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        res.json({
            message: completion.choices[0].message.content,
            usage: completion.usage
        });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500)
    }
});

// 에러 핸들링
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500)
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
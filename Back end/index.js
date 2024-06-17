import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';


dotenv.config();
const API = process.env.API_KEY;




const genai = new GoogleGenerativeAI(API);


const model = genai.getGenerativeModel({

    model:"gemini-1.5-pro"


});

const app = express();
const port = 3001;

// Use body-parser middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a simple POST route for demonstration
app.post ('/chat', async(req, res) => {

    try {

        const { message } = req.body;
        const result= await model.generateContent(message);
        const ans = result.response.text();
        res.status(201).json({ response: ans });
        
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
 
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// openai.js
import OpenAI from 'openai';
import dotenv from 'dotenv'
dotenv.config();

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your actual OpenAI API key
});

export default openai;

import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, dangerouslyAllowBrowser: true });
  const { prompt } = await req.json()

  const instructions = `Summarize this business and do the analysis of the review, based on this JSON data :${prompt} and return the summary in a JSON format
    1. sentiment analysis of the review (should be positive, negative or neutral)
    2. overall rating of the business (should be number between 0 and 5)
    3. pros and cons of the business
    4. recommendation of the business (should be a sentence or two)
  The response should be in the following format:
  {
    "ai_summary": "summary of the all reviews",
    "rating_analysis":{
    "overall_rating": "",
    "pros": ["pros1", "pros2", "pros3", "and so on the more the reviews the more the pros"],
    "cons": ["cons1", "cons2", "cons3", "and so on the more the reviews the more the cons"],
    "service": "between 0 and 5 in float",
    "quality": "between 0 and 5 in float",
    "ambience": "between 0 and 5 in float",
    "location": "between 0 and 5 in float",
    "value": "between 0 and 5 in float",
    "recommendation": "recommendation of the business (should be a sentence or two)"
    },
    "sentiment_analysis": {
    "postitive":{
      "percentage": "in percentage",
      "reviews": "number of reviews showing positive response",
    },
    "negative":{
      "percentage": "in percentage",
      "reviews": "number of reviews showing negative response",
    },
    "neutral":{
      "percentage": "in percentage",
      "reviews": "number of reviews showing neutral response",
    }
    },
    "most_mentioned_words":{
    "positive":["word1", "word2", "word3", "and so on the more the reviews the more the positive words"],
    "negative":["word1", "word2", "word3", "and so on the more the reviews the more the negative words"],
    "neutral":["word1", "word2", "word3", "and so on the more the reviews the more the neutral words"]
    }
  },


  ------------------------------------------------------------
  That is the format of the response, you should return the response in this format only, no other text or comments.
  ------------------------------------------------------------
  For now its in testing so you should return the demo response, I will tell you when there are data in that case you should return the actual response.
  Plus don't stringify the response, just return the response in the actual json.
  `
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: instructions,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  const data = response.choices[0].message.content
  console.log(data)
  return NextResponse.json(data)
}
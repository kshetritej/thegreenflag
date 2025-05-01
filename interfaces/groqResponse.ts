interface SentimentAnalysis {
  percentage: string
  reviews: string
}

export interface GroqResponse {
  ai_summary: string
  rating_analysis: {
    overall_rating: number
    pros: string[]
    cons: string[]
    service: number
    quality: number
    ambience: number
    location: number
    value: number
    recommendation: string
  }
  sentiment_analysis: {
    positive: SentimentAnalysis
    negative: SentimentAnalysis
    neutral: SentimentAnalysis
  }
  most_mentioned_words: {
    positive: string[]
    negative: string[]
    neutral: string[]
  }
}

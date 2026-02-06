import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GeminiOutput, SEOOutput } from '../types';

export class GeminiService {
  private model: GenerativeModel;
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
    this.model = genAI.getGenerativeModel({ model: modelName });
  }

  /**
   * Summarize article content into 3 Hindi bullet points
   */
  async summarizeArticle(content: string): Promise<string[]> {
    const prompt = `
आप एक पेशेवर समाचार संपादक हैं। नीचे दिए गए समाचार लेख को पढ़ें और इसका सारांश 3 बुलेट पॉइंट्स में हिंदी में दें।

महत्वपूर्ण निर्देश:
- केवल 3 बुलेट पॉइंट्स दें
- प्रत्येक पॉइंट 15-20 शब्दों का हो
- मुख्य तथ्यों पर ध्यान दें
- स्पष्ट और संक्षिप्त भाषा का उपयोग करें
- केवल हिंदी में जवाब दें

लेख:
${content}

उत्तर प्रारूप:
• [पहला मुख्य बिंदु]
• [दूसरा मुख्य बिंदु]
• [तीसरा मुख्य बिंदु]
`;

    const response = await this.callWithRetry(prompt);
    return this.parseSummary(response);
  }

  /**
   * Suggest relevant Hindi tags for the article
   */
  async suggestTags(content: string): Promise<string[]> {
    const prompt = `
आप एक समाचार टैग विशेषज्ञ हैं। नीचे दिए गए लेख के लिए 5-7 प्रासंगिक हिंदी टैग्स सुझाएं।

महत्वपूर्ण निर्देश:
- 5-7 टैग्स दें
- प्रत्येक टैग 1-3 शब्दों का हो
- समाचार श्रेणी जैसे: राजनीति, अपराध, खेल, मनोरंजन, व्यापार, तकनीक, स्वास्थ्य, शिक्षा, आदि
- हिंदी में टैग्स दें
- अल्पविराम से अलग करें

लेख:
${content.substring(0, 2000)}

उत्तर प्रारूप:
टैग1, टैग2, टैग3, टैग4, टैग5
`;

    const response = await this.callWithRetry(prompt);
    return this.parseTags(response);
  }

  /**
   * Generate SEO metadata in Hindi
   */
  async generateSEO(title: string, content: string): Promise<SEOOutput> {
    const prompt = `
आप एक SEO विशेषज्ञ हैं। नीचे दिए गए समाचार लेख के लिए SEO मेटाडेटा तैयार करें।

महत्वपूर्ण निर्देश:
- SEO शीर्षक: 50-60 अक्षरों का हो, क्लिक करने योग्य
- मेटा विवरण: 150-160 अक्षरों का हो, सारांश दे
- कीवर्ड्स: 5-7 प्रासंगिक हिंदी कीवर्ड्स
- केवल हिंदी में जवाब दें

लेख शीर्षक: ${title}

लेख सामग्री:
${content.substring(0, 3000)}

उत्तर प्रारूप:
SEO_TITLE: [50-60 अक्षरों का शीर्षक]
META_DESCRIPTION: [150-160 अक्षरों का विवरण]
KEYWORDS: [कीवर्ड1, कीवर्ड2, कीवर्ड3, कीवर्ड4, कीवर्ड5]
`;

    const response = await this.callWithRetry(prompt);
    return this.parseSEO(response);
  }

  /**
   * Translate content between Hindi and English
   */
  async translate(
    content: string,
    direction: 'HI_TO_EN' | 'EN_TO_HI'
  ): Promise<string> {
    const fromLang = direction === 'HI_TO_EN' ? 'हिंदी' : 'English';
    const toLang = direction === 'HI_TO_EN' ? 'English' : 'हिंदी';

    const prompt = `
आप एक पेशेवर अनुवादक हैं। नीचे दिए गए पाठ का ${fromLang} से ${toLang} में सटीक अनुवाद करें।

महत्वपूर्ण निर्देश:
- मूल अर्थ और संदर्भ बनाए रखें
- प्राकृतिक और बोलचाल की भाषा का उपयोग करें
- समाचार शैली में अनुवाद करें
- केवल अनुवादित पाठ दें, कोई अतिरिक्त टिप्पणी नहीं

पाठ:
${content}

अनुवाद:
`;

    const response = await this.callWithRetry(prompt);
    return response.trim();
  }

  /**
   * Complete AI assistant - runs all AI features at once
   */
  async completeAIAssist(title: string, content: string): Promise<GeminiOutput> {
    const prompt = `
आप एक पूर्ण समाचार AI सहायक हैं। नीचे दिए गए लेख के लिए सभी आवश्यक मेटाडेटा तैयार करें।

लेख शीर्षक: ${title}

लेख सामग्री:
${content.substring(0, 4000)}

कृपया निम्नलिखित प्रारूप में उत्तर दें:

---SUMMARY---
• [पहला मुख्य बिंदु - 15-20 शब्द]
• [दूसरा मुख्य बिंदु - 15-20 शब्द]
• [तीसरा मुख्य बिंदु - 15-20 शब्द]

---TAGS---
टैग1, टैग2, टैग3, टैग4, टैग5, टैग6

---SEO---
SEO_TITLE: [50-60 अक्षरों का शीर्षक]
META_DESCRIPTION: [150-160 अक्षरों का विवरण]
KEYWORDS: [कीवर्ड1, कीवर्ड2, कीवर्ड3, कीवर्ड4, कीवर्ड5]
`;

    const response = await this.callWithRetry(prompt);
    return this.parseCompleteResponse(response);
  }

  /**
   * Call Gemini API with retry logic
   */
  private async callWithRetry(prompt: string): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = result.response;
        return response.text();
      } catch (error) {
        lastError = error as Error;
        
        // Check if it's a rate limit error
        if (error instanceof Error && error.message.includes('429')) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          console.log(`Rate limit hit, retrying in ${delay}ms... (attempt ${attempt})`);
          await this.sleep(delay);
          continue;
        }

        // For other errors, retry with backoff
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * attempt;
          await this.sleep(delay);
        }
      }
    }

    throw new Error(
      `Gemini API failed after ${this.maxRetries} attempts: ${lastError?.message}`
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Parse summary response
   */
  private parseSummary(response: string): string[] {
    const lines = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*'));

    return lines
      .map(line => line.replace(/^[•\-*]\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 3);
  }

  /**
   * Parse tags response
   */
  private parseTags(response: string): string[] {
    // Remove any prefix like "टैग्स:" or "Tags:"
    const cleanResponse = response.replace(/^(टैग्स?|tags?):\s*/i, '');
    
    return cleanResponse
      .split(/[,，、]/)  // Split by various comma types
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 7);
  }

  /**
   * Parse SEO response
   */
  private parseSEO(response: string): SEOOutput {
    const titleMatch = response.match(/SEO_TITLE:\s*(.+)/i);
    const descMatch = response.match(/META_DESCRIPTION:\s*(.+)/i);
    const keywordsMatch = response.match(/KEYWORDS:\s*(.+)/i);

    const keywords = keywordsMatch
      ? keywordsMatch[1]
          .split(/[,，、]/)
          .map(k => k.trim())
          .filter(k => k.length > 0)
      : [];

    return {
      title: titleMatch ? titleMatch[1].trim().substring(0, 60) : '',
      metaDescription: descMatch ? descMatch[1].trim().substring(0, 160) : '',
      keywords: keywords.slice(0, 7)
    };
  }

  /**
   * Parse complete AI response
   */
  private parseCompleteResponse(response: string): GeminiOutput {
    const summaryMatch = response.match(/---SUMMARY---\n([\s\S]*?)(?=---TAGS---|$)/);
    const tagsMatch = response.match(/---TAGS---\n([\s\S]*?)(?=---SEO---|$)/);
    const seoMatch = response.match(/---SEO---\n([\s\S]*?)$/);

    const summary = summaryMatch
      ? this.parseSummary(summaryMatch[1])
      : [];

    const tags = tagsMatch
      ? this.parseTags(tagsMatch[1])
      : [];

    const seo = seoMatch
      ? this.parseSEO(seoMatch[1])
      : { title: '', metaDescription: '', keywords: [] };

    return { summary, tags, seo };
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
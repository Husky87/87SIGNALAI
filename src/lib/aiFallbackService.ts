import { GoogleGenAI } from '@google/genai';

export interface OpenAiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerateWithFallbackOptions {
  prompt?: string;
  messages?: OpenAiMessage[];
  systemInstruction?: string;
  model?: string; // Default Gemini model, e.g. 'gemini-3.6-flash'
  fallbackModel?: string; // Default OpenAI model, e.g. 'gpt-4o-mini' or 'gpt-4o'
  temperature?: number;
  responseMimeType?: string;
  responseSchema?: any;
  timeoutMs?: number;
}

export interface NormalizedAiResponse {
  text: string;
  provider: 'gemini' | 'openai';
  modelUsed: string;
  fallbackTriggered: boolean;
  fallbackReason?: string;
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || 'DUMMY_KEY',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

/**
 * Normalizes input options into a standard OpenAI message array:
 * [{ role: "system", content: "..." }, { role: "user", content: "..." }]
 */
export function normalizeOpenAiMessages(options: GenerateWithFallbackOptions): OpenAiMessage[] {
  if (options.messages && options.messages.length > 0) {
    const msgs = [...options.messages];
    if (options.systemInstruction && !msgs.some((m) => m.role === 'system')) {
      msgs.unshift({ role: 'system', content: options.systemInstruction });
    }
    return msgs;
  }

  const msgs: OpenAiMessage[] = [];
  if (options.systemInstruction) {
    msgs.push({ role: 'system', content: options.systemInstruction });
  }
  if (options.prompt) {
    msgs.push({ role: 'user', content: options.prompt });
  }
  return msgs;
}

/**
 * Maps standard OpenAI message structures into Google GenAI SDK contents & systemInstruction
 */
export function mapMessagesToGeminiFormat(messages: OpenAiMessage[]) {
  const systemMsgs = messages.filter((m) => m.role === 'system').map((m) => m.content);
  const systemInstruction = systemMsgs.length > 0 ? systemMsgs.join('\n\n') : undefined;

  const chatMsgs = messages.filter((m) => m.role !== 'system');

  if (chatMsgs.length === 1 && chatMsgs[0].role === 'user') {
    return {
      contents: chatMsgs[0].content,
      systemInstruction
    };
  }

  const contents = chatMsgs.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  return {
    contents,
    systemInstruction
  };
}

/**
 * Multi-provider fallback utility for AI generation.
 * Tries Gemini first and automatically falls back to OpenAI (ChatGPT API)
 * if Gemini hits rate limits (429), errors (500/503), or times out.
 */
export async function generateWithFallback(
  options: GenerateWithFallbackOptions
): Promise<NormalizedAiResponse> {
  const geminiModel = options.model || 'gemini-3.6-flash';
  const openaiModel = options.fallbackModel || 'gpt-4o-mini';
  const temperature = options.temperature ?? 0.2;
  const timeoutMs = options.timeoutMs ?? 25000;

  const normalizedMessages = normalizeOpenAiMessages(options);

  // 1. Attempt generation call using Gemini first
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const ai = getGeminiClient();

    const { contents, systemInstruction } = mapMessagesToGeminiFormat(normalizedMessages);

    const geminiPromise = ai.models.generateContent({
      model: geminiModel,
      contents: contents as any,
      config: {
        systemInstruction: systemInstruction,
        temperature: temperature,
        ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {}),
        ...(options.responseSchema ? { responseSchema: options.responseSchema } : {})
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API request timed out')), timeoutMs);
    });

    const response = await Promise.race([geminiPromise, timeoutPromise]);
    const responseText = response.text || '';

    if (!responseText) {
      throw new Error('Gemini returned an empty response text');
    }

    return {
      text: responseText,
      provider: 'gemini',
      modelUsed: geminiModel,
      fallbackTriggered: false
    };
  } catch (geminiError: any) {
    // 2. Intercept 429 (Rate Limit / Quota Exceeded), 500/503 errors, or timeouts
    const errorMsg = geminiError?.message || String(geminiError);
    const statusCode = geminiError?.status || geminiError?.response?.status;

    console.warn(
      `Gemini limit reached or error occurred [Status: ${statusCode || 'N/A'}]: ${errorMsg}. Falling back to OpenAI...`
    );

    // 3. Fallback Call to OpenAI Chat Completions API using normalized messages payload
    return await executeOpenAIFallback(normalizedMessages, options, openaiModel, errorMsg);
  }
}

async function executeOpenAIFallback(
  normalizedMessages: OpenAiMessage[],
  options: GenerateWithFallbackOptions,
  openaiModel: string,
  reason: string
): Promise<NormalizedAiResponse> {
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!openAiKey) {
    console.error('OPENAI_API_KEY environment variable is not set. Cannot perform fallback to OpenAI.');
    throw new Error(`Gemini failed (${reason}) and OPENAI_API_KEY is missing for fallback.`);
  }

  const bodyPayload: Record<string, any> = {
    model: openaiModel,
    messages: normalizedMessages.map((m) => ({ ...m })),
    temperature: options.temperature ?? 0.2
  };

  if (options.responseMimeType === 'application/json') {
    bodyPayload.response_format = { type: 'json_object' };
    const lastMsg = bodyPayload.messages[bodyPayload.messages.length - 1];
    if (lastMsg) {
      lastMsg.content = `${lastMsg.content}\n\nPlease output the response as a valid JSON object.`;
    }
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAiKey}`
    },
    body: JSON.stringify(bodyPayload)
  });

  if (!response.ok) {
    let errText;
    try {
      errText = await response.text();
    } catch (e) {
      errText = 'Could not read error text';
    }
    console.error(`OpenAI Fallback failed with status ${response.status}: ${errText}`);
    console.error(`Payload: ${JSON.stringify(bodyPayload)}`);
    throw new Error(`OpenAI API fallback call failed [HTTP ${response.status}]: ${errText}`);
  }

  const data = await response.json();
  const responseText = data.choices?.[0]?.message?.content || '';

  return {
    text: responseText,
    provider: 'openai',
    modelUsed: openaiModel,
    fallbackTriggered: true,
    fallbackReason: reason
  };
}


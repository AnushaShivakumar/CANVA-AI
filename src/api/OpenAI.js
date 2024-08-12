import axios from 'axios';
import {apiKey} from '../constants';

const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  },
});

const chatGptEndPoint = 'https://api.openai.com/v1/chat/completions';

export const apiCall = async (prompt, messages) => {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      const res = await client.post(chatGptEndPoint, {
        model: 'gpt-3.5-turbo', // Using the gpt-3.5-turbo model
        messages: [
          {
            role: 'user',
            content: `Does this message want to generate an AI picture, image, art, or anything similar? ${prompt}. Simply answer with a yes or no.`,
          },
        ],
      });

      let isArt = res.data?.choices[0]?.message?.content;
      if (isArt.toLowerCase().includes('yes')) {
        console.log('dalle api call');
        return dalleApiCall(prompt, messages || []);
      } else {
        console.log('Chat gpt api call');
        return chatgptApiCall(prompt, messages || []);
      }
    } catch (err) {
      if (err.response && err.response.status === 429) {
        attempts++;

        // Extract reset time from headers
        const resetTime = err.response.headers['x-ratelimit-reset-requests'];
        const delay = resetTime
          ? parseInt(resetTime) * 1000 + Math.random() * 1000
          : 1000 * Math.pow(2, attempts) + Math.random() * 1000; // Use backoff if no reset time is available

        console.log(
          `Rate limit hit, retrying... Attempt: ${attempts}, waiting ${delay} ms`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.log('Error:', err);
        return {success: false, msg: err.message};
      }
    }
  }

  return {success: false, msg: 'Reached maximum retry attempts'};
};

const chatgptApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatGptEndPoint, {
      model: 'gpt-3.5-turbo',
      messages,
    });
    let answer = res.data?.choices[0]?.messages.content;
    messages.push({role: 'assistant', content: answer.trim()});
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};

const dalleApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(dalleApiCall, {
      prompt: 'A cute baby sea otter',
      n: 1,
      size: '512x512',
    });

    let url = res?.data?.data[0]?.url;
    console.log('got url of the image: ', url);
    messages.push({role: 'assistant', content: url});
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};

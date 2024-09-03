const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/execute', async (req, res) => {
  try {
    const { model, messages } = req.body;
    const endpoint = req.headers['x-llm-endpoint'];
    const apiKey = req.headers['x-llm-apikey'];
    const numCalls = parseInt(req.headers['x-llm-num-calls']) || 1;

    if (!endpoint) {
      return res.status(400).json({ error: 'Missing x-llm-endpoint header' });
    }

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing x-llm-apikey header' });
    }

    const makeApiCall = async (callBody) => {
      return axios.post(endpoint, callBody, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
    };

    if (numCalls === 1) {
      // For single call, just forward the request and return the result
      const response = await makeApiCall({ model, messages });
      return res.json(response.data);
    }

    // For multiple calls
    let currentMessages = [...messages];
    let finalResponse;

    for (let i = 0; i < numCalls; i++) {
      const callBody = { model, messages: currentMessages };
      const response = await makeApiCall(callBody);

      finalResponse = response.data;
      const llmResponse = finalResponse.choices[0].message.content;

      if (i < numCalls - 1) {
        currentMessages = [
          ...currentMessages,
          { role: 'assistant', content: llmResponse },
          { role: 'user', content: 'Review and improve your response maintaining the desired output format. Do not provide any additional comments.' }
        ];
      }
    }

    res.json(finalResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const path = require('path');

const { Configuration, OpenAIApi } = require("openai");
const { type } = require('os');

const configuration = new Configuration({
  apiKey:"API_KEY",
});
const openai = new OpenAIApi(configuration);

const app = express();

// Middleware to set the "Content-Type" header for JavaScript modules
app.use((req, res, next) => {
  if (req.originalUrl.endsWith('.js') && req.path.includes('/')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});
//
app.use(express.json());

app.post('/ai-tarot', (req, res) => {
  const { question, cards } = req.body;
  console.log('Question:', question);
  console.log('Cards:', cards);
  //convert cards to string
  const cardsString = cards.join('\n');
  //call to openai
  getCompletion(question, cardsString).then((result) => {res.json({ message: result });});
  //res.json({ message: 'Data received...await more' });
});


// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});



async function getCompletion(question, cards) {
    try {
      const completion = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [{ role: 'user', content: `You are tarotGPT. Return an interpretation of the following cards in light of the following quesiton- Cards: ${cards}; Question: ${question}. Make sure your interpretation is just a string.` }],
      });
  
      console.log(completion.data.choices[0].message.content);
      return completion.data.choices[0].message.content;
    } catch (error) {
      console.error('Error creating chat completion:', error);
    }
  }
  
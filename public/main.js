import { fetchRandomNumbers } from './randomNumbers.js';
import { tarotCards } from './tarotCards.js';

async function sendToServer(question, cards) {
    try {
      const response = await fetch('/ai-tarot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, cards }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const result = await response.json();
      displayAIResponse(result.message);
      console.log(result);

    } catch (error) {
      console.error('Error sending data to the server:', error);
    } finally {
        hideLoadingIndicator();
    }
};

function displayAIResponse(content) {
  const responseContainer = document.getElementById('responseContainer');
  responseContainer.innerHTML = '';

  const aiResponseElement = document.createElement('p');
  aiResponseElement.textContent = content;
  responseContainer.appendChild(aiResponseElement);
}

function showLoadingIndicator() {
    const inputContainer = document.getElementById('inputContainer');
    const loadingIndicator = document.createElement('p');
    loadingIndicator.id = 'loadingIndicator';
    loadingIndicator.textContent = 'Loading...';
    inputContainer.appendChild(loadingIndicator);
}
  
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
}

function displayCards(cards) {
  const resultContainer = document.getElementById('resultContainer');
  resultContainer.innerHTML = '';

  cards.forEach((card, index) => {
    const cardElement = document.createElement('p');
    cardElement.textContent = `${index + 1}. ${card}`;
    cardElement.id = `card-${index}`;
    resultContainer.appendChild(cardElement);
  });
}

function showAskAIOracleButton() {
  const inputContainer = document.getElementById('inputContainer');
  let askAIOracleButton = document.getElementById('askAIOracle');

  if (!askAIOracleButton) {
    askAIOracleButton = document.createElement('button');
    askAIOracleButton.id = 'askAIOracle';
    askAIOracleButton.textContent = 'Ask AI Oracle';
    inputContainer.appendChild(askAIOracleButton);

    askAIOracleButton.addEventListener('click', () => {
      const question = document.querySelector('textarea').value;
      const cards = Array.from(
        document.querySelectorAll('#resultContainer p')
      ).map((cardElement) => cardElement.textContent);
      showLoadingIndicator();

      sendToServer(question, cards);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const radioButtons = document.getElementsByName('cardOption');
  const inputContainer = document.getElementById('inputContainer');

  radioButtons.forEach((radioButton) => {
    radioButton.addEventListener('change', () => {
      inputContainer.innerHTML = '';
      const resultContainer = document.getElementById('resultContainer');
      resultContainer.innerHTML = '';

      if (radioButton.value === 'own') {
        const select = document.createElement('select');
        for (let i = 1; i <= 10; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.text = i;
          select.appendChild(option);
        }
        inputContainer.appendChild(select);

        const cardInputsContainer = document.createElement('div');
        inputContainer.appendChild(cardInputsContainer);

        select.addEventListener('change', () => {
          cardInputsContainer.innerHTML = '';

          for (let i = 0; i < select.value; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Card ${i + 1}`;
            cardInputsContainer.appendChild(input);
          }
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        inputContainer.appendChild(submitButton);

        submitButton.addEventListener('click', () => {
          const enteredCards = Array.from(
            cardInputsContainer.querySelectorAll('input')
          ).map((input) => input.value);
          displayCards(enteredCards);
          showAskAIOracleButton();
        });
      } else if (radioButton.value === 'random') {
        const generateButton = document.createElement('button');
        generateButton.textContent = 'Generate';
        inputContainer.appendChild(generateButton);

        generateButton.addEventListener('click', async () => {
          try {
            const randomNumbers = await fetchRandomNumbers();
            const randomCards = randomNumbers.map(
              (number) => tarotCards[number]
            );
            displayCards(randomCards);
          } catch (error) {
            console.error('Error fetching random numbers:', error);
          }
          showAskAIOracleButton();
        });
      }
    });
  });
});

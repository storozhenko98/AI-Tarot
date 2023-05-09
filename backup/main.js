import { fetchRandomNumbers } from './randomNumbers.js';
import { tarotCards } from './tarotCards.js';

document.addEventListener('DOMContentLoaded', () => {
  const radioButtons = document.getElementsByName('cardOption');
  const resultContainer = document.getElementById('resultContainer');

  radioButtons.forEach((radioButton) => {
    radioButton.addEventListener('change', async () => {
      resultContainer.innerHTML = '';

      if (radioButton.value === 'own') {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter your cards';
        resultContainer.appendChild(input);
      } else if (radioButton.value === 'random') {
        try {
          const randomNumbers = await fetchRandomNumbers();
          const randomCards = randomNumbers.map((number) => tarotCards[number]);

          randomCards.forEach((card) => {
            const cardElement = document.createElement('p');
            cardElement.textContent = card;
            resultContainer.appendChild(cardElement);
          });
        } catch (error) {
          console.error('Error fetching random numbers:', error);
        }
      }
    });
  });
});

const apiKey = 'c7ba2deb-4ca8-4ef4-b4c8-47fb03014407'; // Replace with your Random.org API key

export async function fetchRandomNumbers() {
  try {
    const response = await fetch(`https://api.random.org/json-rpc/2/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'generateIntegers',
        params: {
          apiKey: apiKey,
          n: 5,
          min: 1,
          max: 72,
          replacement: true,
          base: 10
        },
        id: 1
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`API error: ${data.error.message}`);
    }

    const randomNumbers = data.result.random.data;
    return randomNumbers;
  } catch (error) {
    console.error('Error fetching random numbers:', error);
    throw error;
  }
}

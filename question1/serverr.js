const express = require('express');
const axios = require('axios');


const app = express();
const port = 9876;



let numbers = [];
let prevState = [];

const apiEndpoints = {
    p: 'http://20.244.56.144/test/primes',
    f: 'http://20.244.56.144/test/fibo',
    e: 'http://20.244.56.144/test/even',
    r: 'http://20.244.56.144/test/rand'
};

app.get('/numbers/:numberId', async (req, res) => {
    const numberId = req.params.numberId;
    const endpoint = apiEndpoints[numberId];
    if (!endpoint) {
        return res.status(404).json({ error: 'Invalid number ID' });
    }

    prevState = [...numbers];

    try {
        const response = await axios.get(endpoint, {
            timeout: 500,
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIwNjgwMzYwLCJpYXQiOjE3MjA2ODAwNjAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjczYjZjMDFjLTVkZWYtNGE2Yi1hMTRlLWEzZmNiNGE5MjIzMSIsInN1YiI6InA2cHJpeWFhQGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6IlByaXlhIiwiY2xpZW50SUQiOiI3M2I2YzAxYy01ZGVmLTRhNmItYTE0ZS1hM2ZjYjRhOTIyMzEiLCJjbGllbnRTZWNyZXQiOiJWVkxzRElNTkF4QnplZVFuIiwib3duZXJOYW1lIjoicHJpeWFhIiwib3duZXJFbWFpbCI6InA2cHJpeWFhQGdtYWlsLmNvbSIsInJvbGxObyI6IlIyMUVGMjQ5In0.gKCblH9S9u8opsj65vtWam_r8UBEg03C4lb2P3RFZRU"
            }
        });
        numbers = [...numbers, ...response.data.numbers].slice(-10);  // Keep only the last 10 numbers
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch number from external API', details: error.message });
    }

    const average = numbers.reduce((acc, cur) => acc + cur, 0) / numbers.length;
    res.json({
        windowPrevState: prevState,
        windowCurrState: numbers,
        numbers,
        avg: average.toFixed(2)
    });
});

app.listen(port, () => {
    console.log("Server running on http://localhost:"+port);
});

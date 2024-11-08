let currentSentence = '';

export default async function getSentence() {
    const difficulty = document.getElementById('difficulty').value;
    const prompt = `Provide a sentence in Chinese from a real source (REQUIRED, do not fabricate), provide source link in paranthesis, DLPT ILR Level ${difficulty}. Only reply with the passage, this is for translation practice.`;
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'system', content: prompt }],
                max_tokens: 100,
                temperature: 0.5
            })
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Error response:', response.status, errorDetails);
            return;
        }

        const data = await response.json();
        currentSentence = data.choices[0].message.content.trim();
        document.getElementById('sentence').textContent = currentSentence;
        document.getElementById('result').innerHTML = ''; // Clear previous result
        document.getElementById('translation').value = ''; // Clear input field
    } catch (error) {
        console.error('Error fetching sentence:', error);
    }
}

export async function submitTranslation() {
    const userTranslation = document.getElementById('translation').value.trim();
    const difficulty = document.getElementById('difficulty').value;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a translation expert.' },
                    { role: 'user', content: `Rate the following translation from 1 to 10. Provide feedback if possible, breaking the sentence down and explaining the structure.\n\nOriginal sentence: "${currentSentence}"\nUser translation: "${userTranslation}"\nDifficulty level: DLPT ILR Level ${difficulty}. ` }
                ],
                max_tokens: 300,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Error response:', response.status, errorDetails);
            return;
        }

        const data = await response.json();
        const feedback = data.choices[0].message.content.trim();
        document.getElementById('result').innerHTML = `
            <strong>Original Sentence:</strong> ${currentSentence}<br>
            <strong>Your Translation:</strong> ${userTranslation}<br>
            <strong>Feedback:</strong> ${feedback}
        `;
    } catch (error) {
        console.error('Error submitting translation:', error);
    }
}

// Load the first sentence when the page loads
//window.onload = getSentence;
  
    
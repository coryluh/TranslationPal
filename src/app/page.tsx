"use client"
import { useState } from 'react';
import Dropdown from "./lib/Dropdown"

function SentenceFetcher({ currentSentence} : {currentSentence:string}) {
  return (
    <div>
      {<p style={{ color: 'red' }}>error</p>}
      <button>New Sentence</button>
      <p>{currentSentence || ""}</p>
    </div>
  );
}


function RateButton({currentSentence, currentTranslation} : {currentSentence:string, currentTranslation:string} ){
  //console.log(currentSentence, currentTranslation)
  const [rating, setRating] = useState('');

  const getTranslation = async (sentence:string, translation:string) => {
    //console.log(`${sentence}, ${translation}`);
    const prompt = `Rate the following translation from 1 to 10. Provide feedback if possible, breaking the sentence down and explaining the structure.\n\nOriginal sentence: "${sentence}"\nUser translation: "${translation}. `;
    console.log("Workin on rating")
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
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
      setRating(data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error translation sentence:', error);
    }
  };

  return (
    <div>
      <button onClick={() => getTranslation(currentSentence, currentTranslation)}>Submit</button>
      <p id="result">{rating}</p>
    </div>
    
  ); 
}

export default function Home() {

  const [currentSentence, setCurrentSentence] = useState("Placeholder Sentence");
  const [error, setError] = useState(null);
  const [currentText, setCurrentText] = useState("User Translation");

  const getSentence = async (_difficulty:string) => {
    const prompt = `Provide a sentence in Chinese from the internet (REQUIRED, do not fabricate), provide source link in parentheses, DLPT ILR Level ${_difficulty}. Only reply with the passage, this is for translation practice.`;
    console.log("Workin")
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: prompt }],
          max_tokens: 100,
          temperature: 1
        })
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error response:', response.status, errorDetails);
        return;
      }

      const data = await response.json();
      setCurrentSentence(data.choices[0].message.content.trim());
      setError(null); // Clear any previous error
    } catch (error) {
      console.error('Error fetching sentence:', error);
    }
  };

  const handleSelectionChange = (selectedOption="1+") => {
    getSentence(selectedOption);
  };

  return (
    <div id="container">
      <h1>Chinese Translation GPT Assistant</h1>
      <label>Select ILR Difficulty Level:</label>
      <Dropdown options={["1+", "2", "2+", "3"]} onSelect={handleSelectionChange}></Dropdown>
      <SentenceFetcher currentSentence={currentSentence} />

      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}      
        <input value={currentText} onChange={e=>setCurrentText(e.target.value)}  type="text" id="translation" placeholder="Enter your translation"></input>
      </div>
      <RateButton currentSentence={currentSentence} currentTranslation={currentText} ></RateButton>
    </div>
  );
}

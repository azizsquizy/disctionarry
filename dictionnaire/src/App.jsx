import React, { useEffect, useState ,createContext,useContext} from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import './App.css'
const DictionaryApp = () => {
  const FontContext = createContext();

  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [darkMode, setDarkMode] = useState(false); 
  const [selectedFont, setSelectedFont] = useState('Arial');
  // Track dark mode state

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3001/?q=${word}`);
      const data = await response.json();
      console.log(data);
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;
      console.log(extract);

      setMeaning(extract);

      // Extracting pronunciation
      const pronunciationMatch = extract.match(/enPR: <span>([^<]*)/);
      const pronunciation = pronunciationMatch ? pronunciationMatch[1] : '';
      setPronunciation(pronunciation);

      // Extracting audio URL
      const audioMatch = extract.match(/<audio.*src="([^"]+)"/);
      const audioUrl = audioMatch ? audioMatch[1] : '';
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error(error);
      setMeaning('No results found');
      setPronunciation('');
      setAudioUrl('');
    }
  };

  const handleInputChange = (e) => {
    setWord(e.target.value);
    console.log(selectedFont)
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
    document.documentElement.style.setProperty('--font-family', e.target.value);

  };
  return (
    <div className={`page ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Dictionary App</h1>
      <div className='font-picker-container'>
          <h2>Font Picker:</h2>
          <select value={selectedFont} onChange={handleFontChange}>
            <option value='Arial'>Arial</option>
            <option value='Verdana'>Verdana</option>
            <option value='Helvetica'>Helvetica</option>
            <option value='Times New Roman'>Times New Roman</option>
          </select>
        </div>
      <div className="toggler">
        <span>Dark Mode:</span>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <input
        type="text"
        placeholder="Enter a word"
        value={word}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
      <br />
      <br />
      {meaning && (
        <div>
          <h2>Meaning:</h2>
          <p>{ReactHtmlParser(meaning)}</p>
        </div>
      )}
      {pronunciation && (
        <div>
          <h2>Pronunciation:</h2>
          <p>{pronunciation}</p>
        </div>
      )}
      {audioUrl && (
        <div>
          <h2>Audio:</h2>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) }
    </div>
  );
};

export default DictionaryApp;

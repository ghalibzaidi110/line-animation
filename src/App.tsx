import React from 'react';
import TextAnimation from './TextAnimation';
import LineAnimation from './LineAnimation';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Line animation as background layer */}
      <LineAnimation />
      
      {/* Text animation as foreground layer */}
      <TextAnimation />
    </div>
  );
}

export default App;
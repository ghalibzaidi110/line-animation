import React from 'react';
import TextAnimation from './TextAnimation';
import LineAnimation from './BytesPlatformAnimation';
import FlowerBytesAnimation from './FlowerBytesAnimation';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Line animation as background layer */}
      {/* <LineAnimation /> */}
      <FlowerBytesAnimation />
      {/* Text animation as foreground layer */}
      <TextAnimation />
    </div>
  );
}

export default App;
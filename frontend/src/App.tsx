import React from 'react';
import './App.css';
import { PoIService } from './services/poi.service';
import { PrimaryButton } from '@fluentui/react';

async function RetrieveData() {
  console.log(await (new PoIService().getPoIs()));
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <PrimaryButton
          onClick={() => RetrieveData()}
        >
          Click Me
        </PrimaryButton>
      </header>
    </div>
  );
}

export default App;

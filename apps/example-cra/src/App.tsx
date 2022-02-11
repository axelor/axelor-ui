import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { Button } from '@axelor-ui/core';

function App() {
  const [count, setCount ] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
        <Button variant='primary' onClick={e => setCount(count + 1)}>Count: {count}</Button>
      </header>
    </div>
  );
}

export default App;

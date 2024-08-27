import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Toucan from './Toucan';
import Main from './main';
import reportWebVitals from './reportWebVitals';
import { color } from 'three/webgpu';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Toucan />
    <div className='mmtest'></div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

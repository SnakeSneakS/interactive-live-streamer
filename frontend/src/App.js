import logo from './logo.svg';
import './App.css';
import CaptureButton from './components/CaptureButton.js';
import React, {useState} from "react"


function App() {
  const [video, setVideo] = useState(<video></video>);


  return (
    <div className="App">
      <div>
        <h1>aaa</h1>
        <h2>iii</h2>
        <div>
          <CaptureButton />
        </div>
        <div>
          {video}
        </div>
      </div>
    </div>
  );
}

export default App;

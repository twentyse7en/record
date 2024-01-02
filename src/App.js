import React, { useState, useRef, useEffect } from 'react';

import { AVRecorder } from '@webav/av-recorder';
import recordIcon from './record.svg';

import './App.css';

let recorder;

// TODO
// record after saving file
function App() {
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    setRecording(true);
    try {
      // setup the file to write
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `WebAV-${Date.now()}.mp4`,
      });
      const writer = await fileHandle.createWritable();

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" },
      });
      const recodeMS = stream.clone();
      recorder = new AVRecorder(recodeMS, {
        width: 1920,
        height: 1080,
      });
      await recorder.start();
      recorder.outputStream?.pipeTo(writer).catch(console.error);
      console.log(stream);
      const handleClose = () => {
        recorder?.stop();
        setRecording(false);
      }
      stream.oninactive = handleClose;
    } catch (error) {
      console.error('Error accessing screen:', error);
    }
  };

  const stopRecording = () => {
    recorder?.stop();
  };

  return (
    <section className='home-container'>
      <header>
        <img src={recordIcon} className='logo'/>
        <h1> Screen Recorder </h1>
      </header>
      <div className='home-card'>
        <div>
          <h2> Record screen to mp4 </h2>
          <h3> Privacy first, no data send to server</h3>
        </div>
        <button onClick={startRecording} disabled={recording}>
          Start Recording
        </button>
      </div>
    </section>
  );
}

export default App;

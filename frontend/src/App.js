import React from 'react';
import Navbar from './components/Navbar';
import Main from './components/Main';
import AudioRecorder from './components/AudioRecorder';

const App = () => {
  return (
    <div>
      <Navbar />
      <Main />
      <AudioRecorder/>
    </div>
  );
}

export default App;

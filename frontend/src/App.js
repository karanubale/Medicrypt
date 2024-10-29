import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Main from './components/Main';
import AudioRecorder from './components/AudioRecorder';
import axios from 'axios';
const App = () => {

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api/users");
    console.log(response);
  }
  useEffect(() => {
    fetchAPI();
  }, [])

  return (
    <div>
      <Navbar />
      <Main />
      <AudioRecorder />
    </div>
  );
}

export default App;

import React, { useState, useRef } from 'react';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const audioRef = useRef(null);

    // Start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);

            recorder.ondataavailable = (e) => {
                setAudioBlob(e.data);
                const audioURL = URL.createObjectURL(e.data);
                audioRef.current.src = audioURL; // Preview the recorded audio
            };

            recorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone', error);
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop(); // Stop recording, this will trigger ondataavailable
            setIsRecording(false);
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAudioFile(file);
        const fileURL = URL.createObjectURL(file);
        audioRef.current.src = fileURL; // Preview selected audio file
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Record or Upload Audio</h2>

            {/* Audio Recording Section */}
            <div style={styles.section}>
                <h3 style={styles.subHeading}>Record Audio</h3>
                {isRecording ? (
                    <button style={styles.buttonStop} onClick={stopRecording}>Stop Recording</button>
                ) : (
                    <button style={styles.buttonStart} onClick={startRecording}>Start Recording</button>
                )}
            </div>

            {/* Audio Upload Section */}
            <div style={styles.section}>
                <h3 style={styles.subHeading}>Upload Audio</h3>
                <input type="file" accept="audio/*" onChange={handleFileChange} style={styles.fileInput} />
            </div>

            {/* Audio Player to Preview Audio */}
            <div style={styles.section}>
                <h3 style={styles.subHeading}>Preview Audio</h3>
                <audio ref={audioRef} controls style={styles.audioPlayer} />
            </div>
        </div>
    );
};

// Inline styling for the components
const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
    },
    section: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    subHeading: {
        color: '#555',
        marginBottom: '10px',
    },
    buttonStart: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    buttonStop: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    fileInput: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%',
    },
    audioPlayer: {
        width: '100%',
        marginTop: '10px',
    },
};

export default AudioRecorder;

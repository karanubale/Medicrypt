import React, { useState, useEffect } from "react";
import axios from "axios";
import './AudioRecoder.css';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [prescriptionData, setPrescriptionData] = useState(null);

    useEffect(() => {
        if (isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    }, [isRecording]);

    const handleAudioInputChange = (event) => {
        const file = event.target.files[0];
        setAudioFile(file);
        setAudioURL(URL.createObjectURL(file));
    };

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);
                let chunks = [];

                recorder.ondataavailable = event => {
                    chunks.push(event.data);
                };

                recorder.onstop = () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                    const audioURL = URL.createObjectURL(audioBlob);
                    setAudioURL(audioURL);
                    setAudioFile(new File([audioBlob], "recording.wav", { type: 'audio/wav' }));
                    chunks = [];
                };

                recorder.start();
            })
            .catch(error => {
                console.error("Error accessing microphone:", error);
                alert("Microphone access denied. Please allow microphone access to record audio.");
            });
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };

    const parsePrescription = (prescriptionText) => {
        const prescriptionLines = prescriptionText.split("\n").filter(line => line.trim() !== '');
        const prescriptionData = {};

        prescriptionLines.forEach(line => {
            const match = line.match(/- \*\*(.*?)\:\*\* (.*)/);
            if (match) {
                const key = match[1].replace(/\s+/g, '_').toLowerCase(); // Convert key to snake_case
                const value = match[2].trim();
                prescriptionData[key] = value;
            }
        });

        return prescriptionData;
    };

    const processAudio = async () => {
        if (!audioFile) {
            alert("Please upload an audio file or record one.");
            return;
        }
        const formData = new FormData();
        formData.append("audio", audioFile);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FLASK_API_URL}/process_audio`,
                formData
            );

            // Convert the prescription text to JSON
            const prescriptionJSON = parsePrescription(response.data.prescription);

            // Save to state
            setPrescriptionData(prescriptionJSON);
        } catch (error) {
            console.error("Error processing audio:", error);
            alert("There was an error processing the audio. Please try again.");
        }
    };

    return (
        <div className="audio-recorder-container">
            <h2 className="audio-recorder-heading">Audio Recorder</h2>

            <div className="audio-recorder-section">
                <button
                    className={isRecording ? "audio-recorder-button-stop" : "audio-recorder-button-start"}
                    onClick={() => setIsRecording(prev => !prev)}
                >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
            </div>

            <div className="audio-recorder-section">
                <label htmlFor="audio-upload">Upload Audio File: </label>
                <input
                    type="file"
                    id="audio-upload"
                    accept="audio/wav"
                    onChange={handleAudioInputChange}
                    className="audio-recorder-file-input"
                />
            </div>

            {audioURL && (
                <div className="audio-recorder-section">
                    <h3>Audio Preview</h3>
                    <audio controls src={audioURL}></audio>
                </div>
            )}

            <div className="audio-recorder-section">
                <button className="audio-recorder-button-process" onClick={processAudio}>
                    Process Audio
                </button>
            </div>
            {prescriptionData && (
                <div>
                    <h3>Generated Prescription</h3>
                    <table className="audio-recorder-table">
                        <tbody>
                            {Object.entries(prescriptionData).map(([key, value]) => (
                                <tr key={key}>
                                    <td>{key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</td>
                                    <td>{value || "Not mentioned"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default AudioRecorder;

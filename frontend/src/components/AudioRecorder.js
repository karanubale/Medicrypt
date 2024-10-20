import React, { useState, useEffect } from "react";
import axios from "axios";
import './AudioRecoder.css'; // Import the CSS file

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [audioURL, setAudioURL] = useState(null); // For audio preview
    const [prescriptionData, setPrescriptionData] = useState(null);

    useEffect(() => {
        // Request user permission to access microphone
        if (isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    }, [isRecording]);

    const handleAudioInputChange = (event) => {
        const file = event.target.files[0];
        setAudioFile(file);
        setAudioURL(URL.createObjectURL(file)); // Preview for uploaded file
    };

    const startRecording = () => {
        // Request permission for audio recording
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

    const processAudio = async () => {
        if (!audioFile) {
            alert("Please upload an audio file or record one.");
            return;
        }
        const formData = new FormData();
        formData.append("audio", audioFile);
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FLASK_API_URL}/process_audio`, // Make sure this environment variable is set
                formData
            );
            setPrescriptionData(response.data);
        } catch (error) {
            console.error("Error processing audio:", error);
            alert("There was an error processing the audio. Please try again.");
        }
    };
    

    return (
        <div className="audio-recorder-container">
            <h2 className="audio-recorder-heading">Audio Recorder</h2>

            {/* Recording Section */}
            <div className="audio-recorder-section">
                <button
                    className={isRecording ? "audio-recorder-button-stop" : "audio-recorder-button-start"}
                    onClick={() => setIsRecording(prev => !prev)}
                >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
            </div>

            {/* Upload Section */}
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

            {/* Audio Preview */}
            {audioURL && (
                <div className="audio-recorder-section">
                    <h3>Audio Preview</h3>
                    <audio controls src={audioURL}></audio>
                </div>
            )}

            {/* Process Audio Button */}
            <div className="audio-recorder-section">
                <button className="audio-recorder-button-process" onClick={processAudio}>
                    Process Audio
                </button>
            </div>

            {/* Display Prescription in Table */}
            {prescriptionData && (
                <div>
                    <h3>Generated Prescription</h3>
                    <table className="audio-recorder-table">
                        <tbody>
                            <tr>
                                <td>Patient's Name</td>
                                <td>{prescriptionData.patient_name}</td>
                            </tr>
                            <tr>
                                <td>Age</td>
                                <td>{prescriptionData.age}</td>
                            </tr>
                            <tr>
                                <td>Gender</td>
                                <td>{prescriptionData.gender}</td>
                            </tr>
                            <tr>
                                <td>Chief Complaint</td>
                                <td>{prescriptionData.chief_complaint}</td>
                            </tr>
                            <tr>
                                <td>Medical History</td>
                                <td>{prescriptionData.medical_history}</td>
                            </tr>
                            <tr>
                                <td>Medications</td>
                                <td>{prescriptionData.medications}</td>
                            </tr>
                            <tr>
                                <td>Allergies</td>
                                <td>{prescriptionData.allergies}</td>
                            </tr>
                            <tr>
                                <td>Diagnosis</td>
                                <td>{prescriptionData.diagnosis}</td>
                            </tr>
                            <tr>
                                <td>Treatment Plan</td>
                                <td>{prescriptionData.treatment_plan}</td>
                            </tr>
                            <tr>
                                <td>Follow-up Instructions</td>
                                <td>{prescriptionData.follow_up}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;

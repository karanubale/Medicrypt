import React, { useState, useEffect } from "react";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
import './AudioRecoder.css';
import './ToastStyles.css'; // Import custom Toast styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [prescriptionData, setPrescriptionData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [pateint, setpateint] = useState('');
    const [pateintID, setpateintID] = useState('');
    // const [date, setDate] = useState('');
    const [isdisplay, setisdisplay] = useState(false);
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format today's date as 'YYYY-MM-DD'
    });
    // const REACT_APP_FLASK_API_URL= https://medicrypt-y2d1.onrender.com
    

    // const [newRecordModalOpen, setNewRecordModalOpen] = useState(false);
    const [newRecordKey, setNewRecordKey] = useState('');
    const [newRecordValue, setNewRecordValue] = useState('');

    useEffect(() => {
        if (prescriptionData) {
            // Generate Word file is triggered when prescriptionData is updated
        }
    }, [prescriptionData]);

    useEffect(() => {
        const data = localStorage.getItem('auth');
        if (data) {
            const parsedData = JSON.parse(data); // Parse the string into an object
            setDoctorName(parsedData.name); // Set doctor name using the parsed data
        }
        // console.log(data);
    }, []);

    const suc = () =>
        toast.success('Prescription emailed successfully!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });

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
            const match = line.match(/- \*\*(.*?)\*\* (.*)/);

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
    

        setIsLoading(true);
        const formData = new FormData();
        formData.append("audio", audioFile);

        try {
            const response = await axios.post(
                'https://medicrypt-y2d1.onrender.com/process_audio',
                formData
            );

            const prescriptionJSON = parsePrescription(response.data.prescription);
            setPrescriptionData(prescriptionJSON);
            setIsLoading(false);
        } catch (error) {
            console.error("Error processing audio:", error);
            alert("There was an error processing the audio. Please try again.");
            setIsLoading(false);
        }
    };

    const generateWordFile = () => {
        if (!prescriptionData) return;

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        // Centered title "Prescription Data"
                        new Paragraph({
                            alignment: "center",  // Center alignment
                            children: [
                                new TextRun("Prescription Data"),
                            ],
                        }),

                        // Add Doctor Name, Patient Name, Date, and Patient ID at the top
                        new Paragraph({
                            children: [
                                new TextRun(`Doctor Name: ${doctorName}`),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun(`Patient's Name: ${pateint}`),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun(`Date: ${date}`),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun(`Patient's ID: ${pateintID}`),
                            ],
                        }),

                        // Add a blank line after the details
                        new Paragraph({ children: [] }),

                        // Map through prescription data and create a paragraph for each entry
                        ...Object.entries(prescriptionData).map(([key, value], index) => (
                            [
                                new Paragraph({
                                    children: [
                                        new TextRun(`${key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}: `),
                                        new TextRun({
                                            text: value || "Not mentioned",
                                            bold: true,
                                        }),
                                    ],
                                }),

                                // Blank line after each entry (skip adding for the last element)
                                index < Object.entries(prescriptionData).length &&
                                new Paragraph({ children: [] })  // Empty Paragraph for blank line
                            ]
                        )).flat(),  // Flatten the array to ensure the blank lines are inserted correctly
                    ],
                },
            ],
        });

        return Packer.toBlob(doc);
    };


    const handleDownload = () => {
        if (!doctorName || !pateint || !date || !pateintID) {
            toast.error('Please fill patient information downloading the prescription.');
            // alert("");
            return;
        }
        // Log the values of the form inputs
        // console.log('Doctor Name:', doctorName);
        // console.log('Patient Name:', pateint);
        // console.log('Date:', date);
        // console.log('Patient ID:', pateintID);

        generateWordFile().then((blob) => {
            const downloadURL = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadURL;
            link.download = "prescription.docx";
            link.click();
        });
    };

    const handleSendEmail = async () => {
        const wordFileBlob = await generateWordFile();
        const formData = new FormData();
        formData.append("email", email);
        formData.append("file", wordFileBlob, "prescription.docx");

        try {

            const response = await axios.post(`https://medicrypt-fronted.onrender.com/send-email`, formData);
            // alert(response.data);
            suc();
            setEmailModalOpen(false); // Close the modal
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error('There was an error sending the email.');
            // alert("There was an error sending the email.");
        }
    };

    const addNewRecord = () => {
        if (!newRecordKey || !newRecordValue) {
            toast.error('Both key and value are required.')
            // alert("Both key and value are required.");
            return;
        }

        setPrescriptionData(prevData => {
            const updatedData = {
                ...prevData,
                [newRecordKey.replace(/\s+/g, '_').toLowerCase()]: newRecordValue
            };
            return updatedData;
        });
        // console.log(prescriptionData)
toast.success('New record added')
        setNewRecordKey('');
        setNewRecordValue('');
        setisdisplay(false)
        // setNewRecordModalOpen(false);
    };
    const deleteRecord = (key) => {
        setPrescriptionData(prevData => {
            const updatedData = { ...prevData };
            delete updatedData[key]; // Remove the key from the object
            return updatedData; // Return the updated object
        });
        toast.success('Record Deleted Successfully')
    };



    return (
        <>
            <div className="audio-recorder-container">
                <h2 className="audio-recorder-heading">Audio Recorder</h2>

                <div className="audio-recorder-section">
                    <button
                        className={isRecording ? "audio-recorder-button-stop" : "audio-recorder-button-start"}
                        onClick={() => {
                            setIsRecording(prev => !prev);
                            if (isRecording) {
                                stopRecording();
                            } else {
                                startRecording();
                            }
                        }}
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

                {isLoading && (
                    <div className="audio-recorder-spinner-container">
                        <span className="loader"></span>
                    </div>
                )}


                <hr />
                {prescriptionData && (
                    <div>
                        <h3><span style={{ fontSize: '27px' }}>{"</"}MediCrypt.</span><span >ai{">"}</span></h3>
                        <div>


                            <div className="info">
                                <label>Doctor Name</label>
                                <input
                                    type="text"
                                    placeholder={doctorName}
                                    value={doctorName}
                                    onChange={(e) => setDoctorName(e.target.value)}
                                />
                            </div>
                            <div className="info">
                                <label>Patient's Name</label>
                                <input
                                    type="text"
                                    value={pateint}
                                    onChange={(e) => setpateint(e.target.value)}
                                    required
                                />
                            </div>
                            {/* <div className="info">
                            <label>Patient's Email</label>
                            <input
                                type="text"
                                value={pateintEmail}
                                onChange={(e) => setpateintEmail(e.target.value)}
                            />
                        </div> */}
                            <div className="info">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="info">
                                <label>Patient's ID</label>
                                <input
                                    type="text"
                                    value={pateintID}
                                    onChange={(e) => setpateintID(e.target.value)}
                                    required
                                />
                            </div>


                        </div>

                        <table className="audio-recorder-table">
                            <tbody>
                                {Object.entries(prescriptionData).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</td>
                                        <td>{value || "Not mentioned"}</td>
                                        <td>
                                            <button className="delbtn" onClick={() => deleteRecord(key)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                        {isdisplay && <div className="addrecord">

                            <input
                                type="text"
                                placeholder="Enter key"
                                value={newRecordKey}
                                onChange={(e) => setNewRecordKey(e.target.value)}
                                className="new-record-input"
                            />
                            <input
                                type="text"
                                placeholder="Enter value"
                                value={newRecordValue}
                                onChange={(e) => setNewRecordValue(e.target.value)}
                                className="new-record-input"
                            />
                            <button onClick={addNewRecord} className="new-record-add-button">
                                Add
                            </button>
                            <button onClick={() => setisdisplay(false)} className="new-record-close-button">
                                Close
                            </button>
                        </div>
                        }

                        <div className="action-buttons">

                            <button className="audio-recorder-button-download mx-3" onClick={handleDownload}>
                                Download Prescription as Word File
                            </button>

                            <button className="audio-recorder-button-download mx-3" onClick={() => setEmailModalOpen(true)}>
                                Send Prescription via Email
                            </button>
                            <button className="audio-recorder-button-download mx-3" onClick={() => setisdisplay(true)}>
                                Add Record
                            </button>
                        </div>



                    </div>
                )}

                {emailModalOpen && (
                    <div className="email-modal">
                        <div className="email-modal-content">
                            <h3>Enter Email to Send Prescription</h3>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="email-input"
                            />
                            <button onClick={handleSendEmail} className="email-send-button">
                                Send Email
                            </button>
                            <button onClick={() => setEmailModalOpen(false)} className="email-close-button">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer
                toastClassName="custom-toast"
                bodyClassName="custom-toast-body"
            />
        </>
    );
};

export default AudioRecorder;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
import './TextInput.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './TextInput.css';

const TextInput = () => {
    const [text, setText] = useState('');
    const [prescriptionData, setPrescriptionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [doctorName, setDoctorName] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientID, setPatientID] = useState('');
    const [email, setEmail] = useState('');
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [isdisplay, setisdisplay] = useState(false);
    const [newRecordKey, setNewRecordKey] = useState('');
    const [newRecordValue, setNewRecordValue] = useState('');
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    


    useEffect(() => {
        const token = localStorage.getItem('auth');
        if (token) {
            const parsedData = JSON.parse(token);
            setDoctorName(parsedData.name);
        }
    }, []);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const parsePrescriptionText = (text) => {
        const lines = text.split("\n").filter(line => line.trim() !== '');
        const prescriptionData = {};

        lines.forEach(line => {
            const match = line.match(/- \*\*(.*?)\*\* (.*)/);
            if (match) {
                const key = match[1].replace(/\s+/g, '_').toLowerCase();
                const value = match[2].trim();
                prescriptionData[key] = value;
            }
        });

        return prescriptionData;
    };

    const handleSubmit = async () => {
        if (!text) {
            toast.error('Please provide the input text.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('https://medicrypt-y2d1.onrender.com/process_text', { text });
            const parsedPrescription = parsePrescriptionText(response.data.prescription);
            setPrescriptionData(parsedPrescription);
            toast.success('Prescription generated successfully!');
        } catch (error) {
            toast.error('Error generating prescription.');
        } finally {
            setLoading(false);
        }
    };

    const generateWordFile = () => {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            alignment: "center",
                            children: [new TextRun("Prescription Data")],
                        }),
                        new Paragraph({ children: [new TextRun(`Doctor Name: ${doctorName}`)] }),
                        new Paragraph({ children: [new TextRun(`Patient's Name: ${patientName}`)] }),
                        new Paragraph({ children: [new TextRun(`Date: ${date}`)] }),
                        new Paragraph({ children: [new TextRun(`Patient's ID: ${patientID}`)] }),
                        new Paragraph({ children: [] }),

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

                                index < Object.entries(prescriptionData).length &&
                                new Paragraph({ children: [] })
                            ]
                        )).flat(),
                    ],
                },
            ],
        });

        return Packer.toBlob(doc);
    };

    const handleDownload = () => {
        if (!patientName || !date || !patientID) {
            toast.error('Please fill patient information before downloading the prescription.');
            // alert("Please fill patient information before downloading the prescription.");
            return;
        }

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
            const response = await axios.post('http://localhost:8080/send-email', formData);
            toast.success('Email sent successfully!');
            setEmailModalOpen(false);
        } catch (error) {
            toast.error('Error sending email.');
        }
    };
    const addNewRecord = () => {
      if (!newRecordKey || !newRecordValue) {
        toast.error('Both key and value are required.');
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
};

    return (
        <div className="text-input-container">
            <h2>Generate Prescription Report</h2>
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter the conversation transcript here..."
                rows="8"
                className="text-input-box"
            />
            <div className="button-container">
                <button onClick={handleSubmit} className="submit-button" disabled={loading}>
                    {loading ? 'Processing...' : 'Generate Prescription'}
                </button>
            </div>
<hr />
            {prescriptionData && (
              
                <div >
                  <h3><span style={{ fontSize: '27px' }}>{"</"}MediCrypt.</span><span >ai{">"}</span></h3>
                    <div className="info">
                        <label>Doctor Name</label>
                        <input
                            type="text"
                            value={doctorName}
                            onChange={(e) => setDoctorName(e.target.value)}
                        />
                    </div>
                    <div className="info">
                        <label>Patient's Name</label>
                        <input
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                        />
                    </div>
                    <div className="info">
                        <label>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="info">
                        <label>Patient's ID</label>
                        <input
                            type="text"
                            value={patientID}
                            onChange={(e) => setPatientID(e.target.value)}
                        />
                    </div>

                    <table className="prescription-table">
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
                        <button className="download-button mx-3" onClick={handleDownload}>Download Prescription</button>
                        <button className="email-button mx-3" onClick={() => setEmailModalOpen(true)}>Email Prescription</button>
                        <button className="audio-recorder-button-download mx-3" onClick={() => setisdisplay(true)}>
                            Add Record
                        </button>
                    </div>

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
            )}
            <ToastContainer />
        </div>
    );
};

export default TextInput;

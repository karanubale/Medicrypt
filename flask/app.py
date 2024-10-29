import tkinter as tk
tk._test()
from tkinter import filedialog, messagebox, simpledialog, Entry, Label, Button
import requests
import os
import sounddevice as sd
from scipy.io.wavfile import write
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
# from dotenv import load_dotenvpip 
# change from above to below
from dotenv import load_dotenv
# install requests
import logging

# Load environment variables from a .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
FLASK_API_URL = os.getenv("FLASK_API_URL")
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

class VoicePrescriptionApp:
    def __init__(self, master):
        self.master = master
        master.geometry('300x300')
        master.configure(background='#54a8cc')
        master.title('Voice Prescription')

        self.create_widgets()

    def create_widgets(self):
        btn1 = tk.Button(self.master, text='Upload Audio File', width=25, command=self.doc, bg="#eb7e44")
        btn2 = tk.Button(self.master, text='Start new recording', width=25, command=self.listen, bg="#eb7e44")
        btn3 = tk.Button(self.master, text='Enter Text Prescription', width=25, command=self.create_document, bg="#eb7e44")
        btn4 = tk.Button(self.master, text='Send Document through mail', width=25, command=self.upload_prompt, bg="#eb7e44")
        btn1.pack(pady=20)
        btn2.pack(pady=20)
        btn3.pack(pady=20)
        btn4.pack(pady=20)

    def verify(self, name=None):
        if name:
            p = f"{os.getcwd()}/{name}.docx"
        else:
            filename = filedialog.askopenfilename(initialdir=os.getcwd(), title="Select file", filetypes=(("document files", "*.docx"), ("all files", "*.*")))
            p = filename
        try:
            os.startfile(p)
        except Exception as e:
            logger.error(f"Could not open file: {e}")
            messagebox.showerror("ERROR", "Could not open file")

    def process_audio_file(self, filepath):
        url = f"{FLASK_API_URL}/process_audio"
        try:
            with open(filepath, 'rb') as f:
                files = {'audio': f}
                response = requests.post(url, files=files)
                response.raise_for_status()
                return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Could not process audio file: {e}")
            messagebox.showerror("ERROR", f"Could not process audio file: {e}")
            return None


    def process_text_input(self, text):
        url = f"{FLASK_API_URL}/process_text"
        data = {'text': text}
        try:
            response = requests.post(url, json=data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Could not process text: {e}")
            messagebox.showerror("ERROR", f"Could not process text: {e}")
            return None

    def doc(self):
        filename = filedialog.askopenfilename(initialdir=os.getcwd(), title="Select file", filetypes=(("wav files", "*.wav"),("all files", "*.*")))
        if not filename:
            return

        result = self.process_audio_file(filename)
        if result:
            messagebox.showinfo("Prescription", f"Prescription: {result['prescription']}")
            self.verify("Groq_Prescription_Report")

    def listen(self):
        fs = 44100  # Sample rate
        seconds = 10  # Duration of recording

        messagebox.showinfo("Alert", "Start Speaking")
        recording = sd.rec(int(seconds * fs), samplerate=fs, channels=1, dtype='int16')  # Mono channel, 16-bit PCM
        sd.wait()  # Wait until the recording is finished
        messagebox.showinfo("Alert", "Completed.")

        audio_filename = "recorded_audio.wav"
        write(audio_filename, fs, recording)  # Save as WAV file

        result = self.process_audio_file(audio_filename)
        if result:
            messagebox.showinfo("Prescription", f"Prescription: {result['prescription']}")
            self.verify("Groq_Prescription_Report")
        
        # Remove the file after it is closed
        try:
            os.remove(audio_filename)
        except PermissionError as e:
            logger.error(f"Could not remove file: {e}")


    def create_document(self):
        text = simpledialog.askstring("Input", "Enter prescription details:")
        if text:
            result = self.process_text_input(text)
            if result:
                messagebox.showinfo("Prescription", f"Prescription: {result['prescription']}")
                self.verify("Groq_Prescription_Report")

    def upload_util(self, document_path, emailid):
        toaddr = emailid.get()
        fromaddr = EMAIL_ADDRESS
        msg = MIMEMultipart()
        msg['From'] = fromaddr
        msg['To'] = toaddr
        msg['Subject'] = "Voice prescription"
        body = "Prescription"
        msg.attach(MIMEText(body, 'plain'))

        filename = os.path.basename(document_path)
        with open(document_path, "rb") as attachment:
            p = MIMEBase('application', 'octet-stream')
            p.set_payload(attachment.read())
            encoders.encode_base64(p)
            p.add_header('Content-Disposition', f"attachment; filename= {filename}")
            msg.attach(p)

        try:
            with smtplib.SMTP('smtp.gmail.com', 587) as s:
                s.starttls()
                s.login(fromaddr, EMAIL_PASSWORD)
                s.sendmail(fromaddr, toaddr, msg.as_string())
            messagebox.showinfo("Success", "Prescription sent successfully")
        except smtplib.SMTPException as e:
            logger.error(f"Could not send email: {e}")
            messagebox.showerror("ERROR", "Could not send email")


    def upload_prompt(self, document_path="Groq_Prescription_Report.docx"):
        if not os.path.exists(document_path):
            messagebox.showerror("ERROR", f"The file '{document_path}' does not exist.")
            return  # Exit if the file does not exist

        upload_window = tk.Tk()
        upload_window.geometry('300x200')
        upload_window.configure(background='#79f249')

        label = Label(upload_window, text="E-mail", bg="#ff3f2e")
        label.pack(side=tk.LEFT)
        email = Entry(upload_window, bd=5, width="30")
        email.pack(side=tk.RIGHT)

        submit = Button(upload_window, text="Submit", command=lambda: self.upload_util(document_path, email), bg="#de04da")
        submit.pack(side=tk.BOTTOM)
        upload_window.mainloop()


if __name__ == "__main__":
    root = tk.Tk()
    app = VoicePrescriptionApp(root)
    root.mainloop()



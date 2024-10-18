from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/process_audio', methods=['POST'])
def process_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400
    
    audio_file = request.files['audio']
    # Perform audio processing here
    
    # Example response
    return jsonify({
        "patient_name": "John Doe",
        "age": 30,
        "gender": "Male",
        "chief_complaint": "Headache",
        # Additional prescription data
    })
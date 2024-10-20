from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/process_audio', methods=['POST'])
def process_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided.'}), 400

    audio_file = request.files['audio']
     
    # Here, add your logic to process the audio file.
    
    return jsonify({'message': 'Audio processed successfully.'})


if __name__ == '__main__':
    app.run(debug=True)

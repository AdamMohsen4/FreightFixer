from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import pickle
import numpy as np
from pathlib import Path

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model and vocabulary
model_path = Path(__file__).parent.parent / 'ml' / 'city_correction_model.pth'
vocab_path = Path(__file__).parent.parent / 'ml' / 'model_vocab.pkl'

# Load vocabulary
with open(vocab_path, 'rb') as f:
    vocab_data = pickle.load(f)
    char2idx = vocab_data['char2idx']
    idx2char = vocab_data['idx2char']
    max_input_len = vocab_data['max_input_len']
    max_target_len = vocab_data['max_target_len']

# Define model architecture
class Encoder(torch.nn.Module):
    def __init__(self, input_size, embedding_dim, hidden_dim):
        super().__init__()
        self.embedding = torch.nn.Embedding(input_size, embedding_dim)
        self.lstm = torch.nn.LSTM(embedding_dim, hidden_dim, batch_first=True)

    def forward(self, x):
        embedded = self.embedding(x)
        output, (hidden, cell) = self.lstm(embedded)
        return hidden, cell

class Decoder(torch.nn.Module):
    def __init__(self, output_size, embedding_dim, hidden_dim):
        super().__init__()
        self.embedding = torch.nn.Embedding(output_size, embedding_dim)
        self.lstm = torch.nn.LSTM(embedding_dim, hidden_dim, batch_first=True)
        self.fc = torch.nn.Linear(hidden_dim, output_size)

    def forward(self, x, hidden, cell):
        embedded = self.embedding(x)
        output, (hidden, cell) = self.lstm(embedded, (hidden, cell))
        prediction = self.fc(output)
        return prediction, hidden, cell

class Seq2Seq(torch.nn.Module):
    def __init__(self, encoder, decoder):
        super().__init__()
        self.encoder = encoder
        self.decoder = decoder

    def forward(self, source, target=None, teacher_forcing_ratio=0.5):
        batch_size = source.shape[0]
        target_len = target.shape[1] if target is not None else max_target_len
        outputs = torch.zeros(batch_size, target_len, vocab_size).to(device)

        hidden, cell = self.encoder(source)

        # Start with <SOS> token
        decoder_input = torch.tensor([char2idx.get("<SOS>", 0)] * batch_size, dtype=torch.long, device=device)

        for t in range(target_len):
            decoder_input = decoder_input.unsqueeze(1)
            output, hidden, cell = self.decoder(decoder_input, hidden, cell)
            outputs[:, t, :] = output.squeeze(1)

            if target is not None and torch.rand(1).item() < teacher_forcing_ratio:
                decoder_input = target[:, t]
            else:
                decoder_input = torch.argmax(output, dim=2).squeeze(1)

        return outputs

# Initialize and load model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load model state dict first to get the correct vocabulary size
checkpoint = torch.load(model_path, map_location=device)
vocab_size = checkpoint['vocab_size']
embedding_dim = checkpoint['embedding_dim']
hidden_dim = checkpoint['hidden_dim']

encoder = Encoder(vocab_size, embedding_dim, hidden_dim)
decoder = Decoder(vocab_size, embedding_dim, hidden_dim)
model = Seq2Seq(encoder, decoder).to(device)

# Load model state dict
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

def preprocess_input(text):
    # Convert text to indices
    indices = [char2idx.get(c, 0) for c in text]
    # Pad or truncate to max_input_len
    if len(indices) < max_input_len:
        indices.extend([0] * (max_input_len - len(indices)))
    else:
        indices = indices[:max_input_len]
    return torch.tensor(indices, dtype=torch.long).unsqueeze(0)

def postprocess_output(output):
    # Convert model output to text
    indices = torch.argmax(output, dim=2).squeeze(0).tolist()
    text = ''.join([idx2char.get(idx, '') for idx in indices])
    return text.strip()

@app.route('/correct_city', methods=['POST'])
def correct_city():
    data = request.json
    city = data.get('city', '')
    
    if not city:
        return jsonify({'error': 'No city provided'}), 400
    
    # Preprocess input
    input_tensor = preprocess_input(city)
    
    # Run model
    with torch.no_grad():
        output = model(input_tensor)
    
    # Postprocess output
    corrected_city = postprocess_output(output)
    
    return jsonify({
        'original': city,
        'corrected': corrected_city
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000) 
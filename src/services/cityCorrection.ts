const API_URL = 'http://127.0.0.1:5000';

export interface CityCorrectionResponse {
  original: string;
  corrected: string;
  confidence: number;
}

export async function correctCity(city: string): Promise<CityCorrectionResponse> {
  const response = await fetch(`${API_URL}/correct_city`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city }),
  });

  if (!response.ok) {
    throw new Error('Failed to correct city name');
  }

  return response.json();
}
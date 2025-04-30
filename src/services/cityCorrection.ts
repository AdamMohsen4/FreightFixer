const API_URL = 'http://localhost:5000';

export interface CityCorrectionResponse {
  original: string;
  corrected: string;
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
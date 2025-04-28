# FreightFixer

A web application for detecting and correcting misspelled shipping destination data. It uses machine learning to analyze shipment records, suggest corrections, and update data after user confirmation.

**Features:**

- **GUI**: Built with Vite, React, TypeScript, and shadcn/ui
- **Data Generation**: Synthetic dataset generator for training and testing
- **Address Validation**: Automated detection of typographical errors
- **Correction Suggestions**: ML-powered suggestions for address corrections
- **User Confirmation**: Web interface for reviewing and confirming changes

**Tech Stack:**

- **Frontend**:
  - Vite + React + TypeScript
  - shadcn/ui for beautiful, accessible components
  - Tailwind CSS for styling
  - React Router for navigation and routing
- **Backend**: Python for data processing and ML
- **Data Generation**: Faker library for synthetic data
- **Machine Learning**: (Planned) scikit-learn, PyTorch
- **Database**: (Planned) PostgreSQL

## Running the Application

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Python 3.8+ (for data generation)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/FreightFixer.git
cd FreightFixer
```

2. Install dependencies:

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install pandas faker
```

### Development

To run the application in development mode:

```bash
npm run dev
```

This will:

- Start the Vite development server
- Open the application in your default browser
- Enable hot module replacement for fast development

### Data Generation

To generate synthetic shipment data:

```bash
python src/scripts/dataset_generator.py
```

This will create a CSV file with clean and noisy address data for training and testing.

## Project Structure

- `src/`: Source code
  - `main.tsx`: Application entry point with BrowserRouter setup
  - `App.tsx`: Main application component with route definitions
  - `pages/`: Application pages
  - `components/`: React components
    - `ui/`: shadcn/ui components
  - `scripts/`: Python scripts
    - `dataset_generator.py`: Synthetic data generator

## ML Development

### Data Preparation

- Synthetic data generation using the `dataset_generator.py` script
- Data includes clean and noisy versions of addresses for training
- Features include name, company, street, postal code, and city

### Model Architecture

- **Address Correction**: Sequence-to-sequence model for text correction
- **Error Detection**: Binary classification to identify errors in addresses
- **Postal Code Validation**: Rule-based validation with ML enhancement

### Integration with Frontend

- Model served via REST API
- Real-time correction suggestions in the UI
- Batch processing for large datasets
- Confidence scores for user decisions

### Model Deployment:

- Package the trained model using Flask
- Create an API endpoint to:
  - Accept shipment data inputs.
  - Return suggested corrections with confidence scores.

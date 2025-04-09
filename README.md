# FreightFixer
A desktop application for detecting and correcting misspelled shipping destination data. It uses machine learning to analyze shipment records, suggest corrections, and update data after user confirmation.


 **Features:**
- **Modern Desktop GUI**: Built with Electron and TypeScript
- **Data Generation**: Synthetic dataset generator for training and testing
- **Address Validation**: Automated detection of typographical errors
- **Correction Suggestions**: ML-powered suggestions for address corrections
- **User Confirmation**: GUI for reviewing and confirming changes

**Tech Stack:**
- **Frontend**: Electron, TypeScript, HTML/CSS
- **Backend**: Python for data processing and ML
- **Data Generation**: Faker library for synthetic data
- **Machine Learning**: (Planned) scikit-learn, PyTorch
- **Database**: (Planned) PostgreSQL

## Running the Application

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
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
- Compile the TypeScript files
- Start the Electron application
- Open the development tools (if in development mode)

### Data Generation
To generate synthetic shipment data:
```bash
python src/scripts/dataset_generator.py
```

This will create a CSV file with clean and noisy address data for training and testing.

## Project Structure

- `src/`: Source code
  - `main.ts`: Electron main process
  - `index.html`: Main application UI
  - `renderer.ts`: UI interaction logic
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

### Integration with GUI
- Model served via REST API
- Real-time correction suggestions in the UI
- Batch processing for large datasets
- Confidence scores for user decisions

  ### Model Deployment:
  - Package the trained model using Flask 
  - Create an API endpoint to:
    - Accept shipment data inputs.
    - Return suggested corrections with confidence scores.




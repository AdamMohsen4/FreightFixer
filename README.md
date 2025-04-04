# FreightFixer
AI-powered tool designed to detect and correct misspelled shipping destination data. It leverages machine learning to analyze shipment records, suggest corrections, and update data after user confirmation, helping businesses reduce delivery errors and improve operational efficiency.

 **Features:**
   - Automated detection of typographical errors in shipment addresses.
   -  Typography corrections using ML models 
   -  GUI for reviewing and confirming changes.
   -  Integration capability with external address validation APIs.
   -  Batch processing for large datasets.
    
**Tech Stack:**
  - **Languages:** Python, JavaScript(?)/TypeScript
  - **Machine Learning:** scikit-learn, PyTorch; (spaCy) for NLP tasks
  - **Backend Framework:** Flask for RESTful API development
  - **Database:** PostgreSQL (relational data)
  - **Other Tools:** Git for version control

## Running the Application

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/FreightFixer.git
cd FreightFixer
```

2. Install dependencies:
```bash
npm install
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

### Production Build
To create a production build:
```bash
npm run build
```

The compiled files will be available in the `dist` directory.

   ## ML Development

- **Data Collection & Preprocessing:**
  - Collect real-world shipment data (or mock data), including:
    - Addresses (correct and incorrect), cities, postal codes, volumes, etc.
  - Preprocess data to:
    - Remove duplicates and irrelevant entries.
    - Standardize formats (e.g., street abbreviations, casing, header uniformity).
    - Handle missing or incomplete entries with appropriate strategies.
   
   - **Model Deployment:**
  - Package the trained model using Flask 
  - Create an API endpoint to:
    - Accept shipment data inputs.
    - Return suggested corrections with confidence scores.




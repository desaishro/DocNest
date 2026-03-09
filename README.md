# DocNest – AI-Powered Accreditation & Ranking Support Platform

DocNest is a full-stack web application designed to assist academic institutions in managing documentation required for accreditation and ranking processes. It provides a centralized digital platform to organize, track, and analyze institutional records for frameworks such as NBA, NAAC, and NIRF.

The system integrates AI-powered document classification, intelligent search, and accreditation readiness analytics to help institutions reduce manual effort, improve transparency, and maintain continuous compliance readiness.

🔗 **Live Demo**: [https://nba-rose.vercel.app](https://nba-rose.vercel.app)

---

## 📑 Table of Contents
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Available Scripts](#available-scripts)
- [Contributing](#contributing)


---

# 🚀 Key Features

### Multi-Framework Accreditation Support
Supports documentation management for multiple accreditation and ranking frameworks including:
- NBA (National Board of Accreditation)
- NAAC (National Assessment and Accreditation Council)
- NIRF (National Institutional Ranking Framework)

### AI-Based Document Classification
Uses AI models to automatically categorize uploaded documents according to accreditation criteria such as research publications, events, faculty activities, and student performance.

### Smart Semantic Search
Enables intelligent search across documents using keywords, metadata, and AI-generated tags, allowing evaluators to quickly retrieve relevant files.

### Role-Based Access Control
Provides secure authentication using role-based permissions for:
- Administrators
- Faculty members
- Institutional reviewers
- Evaluators

### Accreditation Readiness Dashboard
Interactive dashboards visualize:
- Department-wise progress
- Missing accreditation requirements
- Year-wise document submissions

### Audit Logs & Traceability
Every upload, modification, and access event is tracked through audit logs, ensuring full transparency and accountability.

### Real-Time Collaboration
Faculty and reviewers can comment, review, and update documents collaboratively within the platform.

### Automated Archival System
Documents older than a defined period are automatically archived while remaining accessible for historical audits.

### Scalable and Containerized Architecture
The entire system is containerized using Docker to enable scalable and efficient deployment.

---

# 🛠️ Technology Stack

## Frontend
ReactJS – Dynamic user interface  
HTML5 – Page structure  
CSS3 – Styling and layout  
JavaScript – Client-side logic  

## Backend
Node.js – Server-side runtime  
Express.js – REST API framework  

## Database
MongoDB – NoSQL database for storing metadata  
MongoDB GridFS – Efficient storage of large documents

## AI & Machine Learning
Python – AI service layer  
FastAPI – API framework for AI services  
NLP Models – Document classification and semantic search  
OCR – Text extraction from uploaded documents  

## Authentication
JWT (JSON Web Tokens) – Secure authentication and access control

## Data Visualization
Chart.js / Recharts – Interactive dashboards and analytics

## DevOps & Deployment
Docker – Containerization  
Docker Compose – Multi-container orchestration  
GitHub Actions / Jenkins – CI/CD pipeline  

## Version Control
Git & GitHub

---

# 📁 Project Structure

```
DocNest
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   └── App.js
│
├── server
│   ├── controllers
│   ├── routes
│   ├── models
│   └── server.js
│
├── ai-services
│   ├── models
│   ├── classification
│   └── search
│
├── docker
│   └── docker-compose.yml
│
├── .env
└── README.md
```

---

# 🏁 Getting Started

Follow these steps to run DocNest locally.

---

## Prerequisites

Ensure the following are installed:

Node.js (v16 or higher)  
Python (v3.8 or higher)  
MongoDB  
Docker & Docker Compose  
npm or yarn  
Git  

---

# ⚙️ Installation

### Clone the Repository

```
git clone https://github.com/desaishro/docnest.git
cd docnest
```

### Install Backend Dependencies

```
cd server
npm install
```

### Install Frontend Dependencies

```
cd ../client
npm install
```

### Install AI Service Dependencies

```
cd ../ai-services
pip install -r requirements.txt
```

---

# ▶️ Running the Application

### Start MongoDB

Ensure MongoDB is running locally or through Docker.

### Start Backend Server

```
cd server
npm run dev
```

### Start Frontend Application

```
cd client
npm start
```

### Start AI Service

```
cd ai-services
uvicorn main:app --reload
```

The application should now run at:

```
http://localhost:3000
```

---

# 📊 System Modules

### Document Upload & AI Categorization
Documents uploaded by faculty are automatically analyzed by AI models to classify them according to NBA, NAAC, or NIRF criteria.

### Smart Search & Filtering
Users can search documents by keywords, department, academic year, or accreditation criterion.

### Dashboard & Accreditation Status
Interactive charts show accreditation readiness, department contributions, and missing documentation.

### Security & Lifecycle Management
Role-based authentication and automated archival ensure data integrity and long-term maintainability.

---

# 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for improvements, new features, or bug fixes.

Steps to contribute:

1. Fork the repository  
2. Clone your fork

```
git clone https://github.com/desaishro/docnest.git
```

3. Create a new branch

```
git checkout -b feature-name
```

4. Commit your changes

```
git commit -m "Added new feature"
```

5. Push to GitHub

```
git push origin feature-name
```

6. Create a Pull Request

---

⭐ If you like this project, consider giving it a star on GitHub!

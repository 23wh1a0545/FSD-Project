NoteStack — MERN Based Notes Management Platform

1. Introduction

1.1 Purpose

This document defines the end-to-end technical design and development guidelines for
NoteStack, a MERN-based Notes Management Platform.
The platform is designed to demonstrate full-stack architecture using:

● React (Frontend)
● Node.js + Express (Backend)
● MongoDB (Database)

The system enables users to create, view, and delete digital notes through a REST-based
architecture.

1.2 Target Audience

● Students learning MERN stack
● Beginners in full-stack development
● Developers practicing REST API architecture
● Academic evaluators reviewing full-stack implementation

1.3 Learning Outcomes

● REST API design using Express
● MongoDB schema modeling using Mongoose
● Frontend–backend integration using React & Axios
● CRUD operations implementation
● Understanding MERN stack architecture


2. System Overview

2.1 User Roles

Role Description
User Creates, views, and deletes
notes
(Single-user system — no role-based access required in current version.)

2.2 Core Features

● Create digital notes
● View saved notes
● Delete notes
● Real-time frontend–backend data synchronization


3. High-Level Architecture

[ React Application ]
|
| REST API (Axios)
|
[ Node.js + Express Backend ]
|
|
[ MongoDB ]
Key Principle
Backend handles all business logic.
Frontend handles only presentation.
Database is accessed strictly through backend APIs.


4. Database Design (DB-First Approach)

4.1 Database

● MongoDB (Local or Atlas)
● ODM: Mongoose

4.2 Collections

4.2.1 notes
{
"_id": "ObjectId",
"title": "string",
"description": "string",
"createdAt": "Date",
"updatedAt": "Date"
}
Indexes:
● Optional: title


5. Backend Design (Node.js + Express)

5.1 Technology Stack

● Node.js
● Express.js
● MongoDB + Mongoose
● CORS
● dotenv

5.2 Backend Folder Structure
backend/
│── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── app.js
│── .env
│── package.json

5.3 API Endpoints
Notes APIs
Method Endpoint Description
POST /api/v1/notes Create new note
GET /api/v1/notes Retrieve all
notes
DELETE /api/v1/notes/:id Delete note
All APIs return JSON responses.


6. Frontend – MERN (React)

6.1 Tech Stack

● React
● React Router (optional)
● Axios
● CSS

6.2 Folder Structure

src/
├── components/
├── pages/
├── services/
└── App.jsx

6.3 Key Pages

● Dashboard Page (View Notes)
● Add Note Page


7. Security Considerations

● Input validation at backend
● Error handling middleware
● CORS configuration
● No direct database access from frontend
(Authentication can be added in future.)


8. Development Workflow

● Define MongoDB schema first
● Build backend APIs
● Test using Postman
● Integrate frontend using Axios
● Maintain structured GitHub repository


9. Future Enhancements

● Update/Edit note feature
● User authentication using JWT
● Search and filtering
● Cloud deployment
● Multi-user note separation


10. Conclusion

NoteStack demonstrates a complete MERN stack implementation using a clean and structured
architecture.
The project focuses on clarity of design, proper REST API usage, and real-world
frontend–backend communication.
It serves as a foundational full-stack application aligned with academic learning objectives.


Project Name : NoteStack

Document Owner : Afiya Begum
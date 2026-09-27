# Student Management REST API

**Lab Assignment 2 – Web Dev III (Node.js & Express)**

### Author Information
- **Name:** Harsh Dev Jha
- **Roll No:** 2501010168

---

## Overview
A lightweight RESTful API built with **Node.js** and **Express.js** to manage student records using in-memory JSON data, modular routing, custom logging middleware, and status code handling.

---

## Project Structure
```text
├── data/
│   └── students.js           # In-memory student array dataset
├── middleware/
│   └── logger.js             # Custom request logging middleware
├── routes/
│   └── studentRoutes.js      # Express Router for student CRUD routes
├── app.js                    # Express app initialization & server setup
├── test-api.js               # Automated test script
├── package.json              # Dependencies and scripts
└── README.md                 # Documentation
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm start
```
Server runs on `http://localhost:3000`.

### 3. Run Automated Tests
```bash
node test-api.js
```

---

## API Summary

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **GET** | `/students` | Retrieve all student records | `200` |
| **GET** | `/students/:id` | Retrieve single student by ID | `200`, `404` |
| **POST** | `/students` | Create a new student record | `201`, `400` |
| **PUT** | `/students/:id` | Update an existing student | `200`, `400`, `404` |
| **DELETE** | `/students/:id` | Remove student record by ID | `200`, `404` |

---

## Sample Request Payloads

### POST /students
```json
{
  "id": 4,
  "name": "Harsh Dev Jha",
  "course": "BCA"
}
```

### PUT /students/4
```json
{
  "name": "Harsh Dev Jha",
  "course": "BTech"
}
```

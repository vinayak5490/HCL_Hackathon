✅ Overview

This project is a Healthcare Wellness & Preventive Care Portal designed to help patients track daily wellness goals and stay compliant with preventive checkups, while enabling healthcare providers to monitor patient progress.
The system focuses on security, personalization, and healthcare data privacy while demonstrating seamless integration of React (frontend), Node.js (backend), and MongoDB.

🎯 Problem We Solve

Modern healthcare struggles with:

Patients forgetting preventive checkups

Lack of simple tools to track daily wellness habits

Providers having no visibility into patient compliance

The need for secure and privacy-focused data handling

Our portal provides a real-world solution by offering:

Preventive reminders

Goal tracking

Patient → Provider visibility

Secure authentication & role-based access

✔️ Solution Summary

This MVP demonstrates a small yet powerful preventive healthcare ecosystem:

🧑‍⚕️ Patients Can

Track daily goals (steps, water intake, sleep, etc.)

View preventive care reminders (annual tests, vaccinations)

Edit their profile (age, weight, allergies, medications)

See health tips of the day

Stay compliant with recommended checkups

🩺 Providers Can

View all assigned patients

Check patient goal compliance

View patient preventive checkup status

Monitor progress with a clean dashboard

🚦 Happy Flow of the Application
1️⃣ User Registration

User registers as Patient or Healthcare Provider

Provides basic info (name, email, age, weight, allergies, medications)

Password is securely hashed

Must accept data usage consent (for healthcare privacy)

Role is saved in database (patient / provider)

2️⃣ Login & Authentication

User logs in with email + password

Backend validates credentials

JWT token is issued with:

user id

role

expiration time

Token is stored on frontend for subsequent API calls

3️⃣ Patient Flow
Dashboard Includes:

Daily Wellness Goal Progress

Preventive Care Reminders

Personalized “Health Tip of the Day”

Actions Patient Can Perform

Log daily goals (steps, water intake, etc.)

Edit/update personal profile

View preventive reminders

Stay on track with compliance

4️⃣ Provider Flow
Provider Dashboard Shows:

List of assigned patients

Each patient’s:

goal compliance (met/missed)

preventive checkup status

Clickable patient view

shows profile

recent wellness logs

compliance trends

Providers can quickly identify which patients need attention.

5️⃣ Public Health Information Page

Accessible without login

Contains general health advice

Includes privacy policy

Shows commitment to healthcare awareness and data safety

🏗️ System Architecture
┌──────────────────────────────────────────┐
│               FRONTEND (React + Vite)    │
│------------------------------------------│
│ - User Registration & Login UI           │
│ - Patient Dashboard                      │
│ - Provider Dashboard                     │
│ - Goal Tracker UI                        │
│ - Profile Management                     │
│ - Public Health Info Page                │
│ - Uses JWT for authentication (Bearer)   │
└──────────────────────────────────────────┘
                 │  REST API Calls (HTTPS)
                 ▼
┌──────────────────────────────────────────┐
│          BACKEND (Node.js + Express)     │
│------------------------------------------│
│ Auth Module                              │
│ - Register/Login                         │
│ - JWT generation                         │
│ - Password hashing (bcrypt)              │
│                                          │
│ Patient Module                           │
│ - Manage goals                           │
│ - Preventive reminders                   │
│ - Profile CRUD                            │
│                                          │
│ Provider Module                          │
│ - Assigned patients                      │
│ - Compliance tracking                    │
│                                          │
│ Middleware                               │
│ - JWT auth                               │
│ - Role-based access                      │
│ - Request logging                        │
│                                          │
└──────────────────────────────────────────┘
                 │  Secure DB Operations
                 ▼
┌──────────────────────────────────────────┐
│           DATABASE (MongoDB)             │
│------------------------------------------│
│ Collections:                             │
│ - users (patient/provider)               │
│ - goals (daily wellness tracking)        │
│ - preventiveReminders                    │
│                                          │
│ Ensures:                                 │
│ - Encrypted data flow                    │
│ - Scalable document-based storage        │
└──────────────────────────────────────────┘

🔐 Security & Privacy Measures (MVP Level)

JWT-based authentication

Role-based access control

Encrypted passwords (bcrypt)

Consent checkbox during registration

Logging of key user actions

No sensitive data stored unencrypted

Environment variables for secrets

🚀 Deployment & DevOps

Frontend deployed on Vercel / Netlify

Backend deployed on Render / Railway / AWS

MongoDB hosted on MongoDB Atlas

CI/CD using GitHub Actions

Linting

Basic automated tests

Auto-deploy on push

🎁 MVP Deliverables

Secure auth (register/login)

Patient dashboard

Provider dashboard

Goal tracker

Preventive reminders

Profile management

Public health info page

Cloud deployed frontend + backend

CI/CD pipeline

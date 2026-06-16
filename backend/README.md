# Itransition Task #4 - User Management System

A full-stack User Management System built using Laravel (backend), React with TypeScript (frontend), and MySQL database.

## 🚀 Features

- User registration with email verification (async email sending)
- Secure login/logout system
- Admin dashboard for user management
- Bulk actions: Block, Unblock, Delete, Delete Unverified
- Select all / deselect all using checkboxes
- Users sorted by last login time
- Database-level UNIQUE INDEX on email (ensures data integrity)
- Server-side validation for blocked/unverified users
- Auto redirect to login if user is blocked or deleted
- Responsive business-style UI using Bootstrap

## 🛠️ Tech Stack

- Backend: Laravel
- Frontend: React + TypeScript (Vite)
- Database: MySQL
- UI: Bootstrap

## 🗄️ Database Requirement

- UNIQUE INDEX on `email` column (NOT application-level check)
- Ensures no duplicate email entries even under concurrent requests

## 🔐 Security Rules

- Only authenticated users can access admin panel
- Blocked users cannot login
- Deleted users are removed from database (can re-register)

## 📌 Important Notes

- No row-level action buttons allowed
- All actions are performed via toolbar
- No animations or unnecessary UI effects
- Clean and professional UI required

## ▶️ Setup Instructions

### Backend (Laravel)
```bash
cd backend
composer install
php artisan migrate
php artisan serve
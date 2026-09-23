# LinkedIn Clone

A full-stack LinkedIn clone built to replicate the core functionalities of the professional networking platform. This project features user authentication, a dynamic post feed, image uploads, real-time-like interactions, and a fully responsive modern UI.

## 🚀 Features

- **User Authentication**: Secure signup and login using JWT (JSON Web Tokens) and bcryptjs for password hashing. Google OAuth integration included.
- **Dynamic Feed**: View, create, and interact with posts (likes and comments) in a responsive feed.
- **Image Uploads**: Media support for profile pictures and post attachments powered by Cloudinary and Multer.
- **User Profiles**: View and edit user profiles, including experience, skills, and summary sections.
- **Networking & Messaging**: Connect with other users and exchange messages.
- **Form Validation**: Robust client-side validation using Formik and Yup, alongside Joi for backend validation.
- **Responsive Design**: Beautiful, mobile-first design using Tailwind CSS and Material UI components.

## 💻 Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **UI Library**: [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Material UI (MUI)](https://mui.com/)
- **Forms & Validation**: Formik & Yup
- **Alerts**: React Hot Toast

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via `pg` package)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Storage**: Cloudinary (handled via Multer)

## 📂 Project Structure

This is a monorepo setup containing both the frontend client and backend server.

```text
linkedin-clone/
├── client/           # Next.js frontend application
│   ├── src/app/      # Next.js App Router pages (feeds, messages, profile, etc.)
│   ├── src/components/ # Reusable UI components
│   └── package.json  # Frontend dependencies
└── server/           # Node.js/Express backend application
    ├── controllers/  # Route logic (auth, posts, users, likes)
    ├── models/       # PostgreSQL data models and queries
    ├── routes/       # Express API routes
    ├── utils/        # Cloudinary setup and helpers
    └── package.json  # Backend dependencies

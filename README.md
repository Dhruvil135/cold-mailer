# Coldmailer Backend API

Coldmailer is an automated cold emailing backend service that extracts candidate and recruitment details with AI, generates customized cold emails, and sends them via SMTP.

---

## Features
- **Authentication**: JWT-based user registration and login
- **AI-Powered Extraction**: Image-based extraction of recruitment posts and resumes
- **Automated Cold Email Generation**: AI drafts tailored emails based on job opportunity details and candidate profiles
- **SMTP Email Dispatch**: Send generated emails directly with resume attachment
- **Vercel Serverless Ready**: Configured for deployment as a Vercel Serverless Function

---

## Project Structure
```text
COLDMAILER/
├── api/
│   └── index.js             # Vercel Serverless function entry point
├── config/
│   ├── cloud.config.js      # Cloudinary configuration
│   └── db.js                # Cached MongoDB connection for serverless
├── controller/
│   ├── auth.controller.js
│   ├── extraction.controller.js
│   ├── file.controller.js
│   └── mail.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── multer.middleware.js # In-memory file buffer handling
├── model/
│   ├── auth.model.js
│   ├── extraction.model.js
│   ├── file.model.js
│   └── mail.model.js
├── routes/
│   ├── auth.routes.js
│   ├── file.routes.js
│   └── mail.routes.js
├── services/
│   ├── email.service.js
│   └── mail.service.js
├── utils/
│   └── ai.utils.js
├── .env.example             # Template for required environment variables
├── .gitignore
├── index.js                 # Express app definition & local server
├── package.json
└── vercel.json              # Vercel routing & function configuration
```

---

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`.

---

## Vercel Deployment Guide

### Option 1: Deploy via GitHub (Recommended)

1. **Initialize Git and commit your files:**
   ```bash
   git init
   git add .
   git commit -m "Configure project for Vercel deployment"
   ```

2. **Push to GitHub:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/Dhruvil135/cold-mailer.git
   git push -u origin main
   ```

3. **Import into Vercel:**
   - Log into [Vercel](https://vercel.com).
   - Click **Add New...** > **Project**.
   - Import your GitHub repository.
   - Leave the **Framework Preset** as **Other**.
   - Leave the root directory as `./`.

4. **Add Environment Variables in Vercel:**
   In your Vercel project settings under **Environment Variables**, add:
   - `MONGODB_URL`: Your MongoDB connection string (ensure IP access `0.0.0.0/0` is enabled in MongoDB Atlas Network Access)
   - `JWT_SECRET`: Secret key used for signing JWT tokens
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Cloudinary API secret
   - `OPENROUTER_API_KEY`: OpenRouter API key for LLM generation
   - `SMTP_HOST`: e.g. `smtp.gmail.com`
   - `SMTP_PORT`: e.g. `587`
   - `SMTP_USER`: Sender email address
   - `SMTP_PASS`: Gmail App Password (16 characters)

5. **Deploy:**
   Click **Deploy**. Your API will be live at `https://<project-name>.vercel.app`.

---

### Option 2: Deploy via Vercel CLI

1. **Deploy using npx:**
   ```bash
   npx vercel
   ```
   Follow the prompts to link or create a project.

2. **Deploy to production:**
   ```bash
   npx vercel --prod
   ```

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Health check & DB connection status | No |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive JWT token | No |
| `POST` | `/api/files/upload` | Upload resume/file to Cloudinary | Yes |
| `POST` | `/api/files/extract` | Extract info from image/screenshot | Yes |
| `POST` | `/api/mails/generate` | Generate 3 tailored cold emails with AI | Yes |
| `GET` | `/api/mails/` | Retrieve user's saved email drafts | Yes |
| `GET` | `/api/mails/email/:id`| Retrieve single email by ID | Yes |
| `PUT` | `/api/mails/update/:id`| Update subject/body of draft | Yes |
| `DELETE`| `/api/mails/delete/:id`| Delete draft | Yes |
| `POST` | `/api/mails/send` | Send email via SMTP & delete remaining drafts | Yes |


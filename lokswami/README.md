# Lokswami - Hindi News Platform

A production-ready Hindi news platform built with the MERN stack and Google Gemini AI integration.

![Lokswami Logo](./docs/design-system.md)

## 📋 Project Structure

```
lokswami/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite News Website
├── admin/            # React + Vite Admin CMS
└── docs/             # Documentation
```

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express** (TypeScript)
- **MongoDB** + **Mongoose**
- **Google Gemini 1.5 Flash** (AI)
- **Cloudinary** (Media storage)
- **JWT** (Authentication)

### Frontend
- **React 19** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **TanStack Query**

### Admin CMS
- **React 19** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Zustand** (State management)

## 🛠️ Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Google Gemini API key
- Cloudinary account

### 1. Clone and Setup

```bash
git clone <repository-url>
cd lokswami
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### 4. Admin Setup

```bash
cd admin
cp .env.example .env.local
npm install
npm run dev
```

## ⚙️ Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

### Admin (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Deployment

### Backend (Render.com)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables

### Frontend (Vercel)
1. Import your GitHub repository
2. Set framework preset to Vite
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables

### Admin (Vercel/Netlify)
1. Same steps as frontend
2. Deploy from `/admin` directory

## ✨ Features

### News Website
- 🏠 Bento Grid homepage layout
- 📰 Breaking news ticker
- 🔍 Search and category filtering
- 📱 Mobile-responsive design
- 📄 E-Paper viewer
- 🔗 Social sharing

### Admin CMS
- 📝 Article editor with AI assistance
- 🔄 Editorial workflow (Draft → Review → Published)
- 🤖 One-click AI (summary, tags, SEO)
- 🖼️ Media management
- 📊 Dashboard with stats
- 👥 User management

### AI Features (Google Gemini)
- 📝 Article summarization (3 Hindi bullet points)
- 🏷️ Tag suggestions
- 🔍 SEO metadata generation
- 🌐 Hindi ↔ English translation

## 🎨 Design System

### Colors
- **Primary**: Deep Maroon (#8B0000)
- **Secondary**: Saffron (#FF9933)
- **Accent**: Gold (#FFD700)
- **Breaking**: Red (#DC2626)

### Typography
- **Hindi**: Noto Sans Devanagari
- **English**: Inter

## 📄 API Documentation

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

### Articles
- `GET /api/articles` - List articles
- `GET /api/articles/:slug` - Get single article
- `POST /api/articles` - Create article
- `PATCH /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### AI
- `POST /api/ai/summarize` - Summarize content
- `POST /api/ai/tags` - Suggest tags
- `POST /api/ai/seo` - Generate SEO
- `POST /api/ai/complete` - Complete AI assist

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Cloudinary](https://cloudinary.com/) for media storage

---

Made with ❤️ for Hindi journalism
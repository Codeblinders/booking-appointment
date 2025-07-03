# Student‑Teacher Appointment System

A full‑stack web application that lets students and teachers manage one‑on‑one appointments.  
Students can register, browse teacher availability, and book appointment slots.  
Teachers can register, set their availability, view upcoming appointments, and approve or cancel requests.

---

## 🚀 Features

- **Role‑based Authentication**  
  - Students and teachers register & log in via separate flows  
  - JWT‑based auth stored in `localStorage`

- **Student Dashboard**  
  - Browse teacher listings  
  - View teacher availability calendar  
  - Book, view, and cancel appointment requests

- **Teacher Dashboard**  
  - Set weekly availability slots  
  - View pending appointment requests  
  - Approve or reject bookings  
  - Calendar view of upcoming appointments

- **Responsive UI**  
  - Built with React 18 + Material‑UI (MUI)  
  - Mobile‑friendly layouts

- **Serverless API**  
  - Node.js + Express.js deployed as Vercel Serverless Functions  
  - Organized under `api/v1/…`

- **Notifications**  
  - Toast messages (react‑hot‑toast) on success/error  
  - Email reminders (optional extension)

---

## 📦 Tech Stack

- **Frontend**  
  - React 18, React Router v6  
  - Material‑UI (MUI)  
  - react‑hot‑toast  
  - Vite (build tool)  

- **Backend**  
  - Node.js 16.x, Express.js  
  - Vercel Serverless Functions  
  - MongoDB Atlas (or your preferred MongoDB)  
  - JWT for auth  

- **Deployment**  
  - Vercel (frontend & API)  
  - Environment variables via Vercel Dashboard

---

## 📝 Folder Structure

```

/
├─ api/
│   └─ v1/
│       ├─ user/
│       │   ├─ register.js
│       │   └─ login.js
│       ├─ appointment/
│       │   ├─ create.js
│       │   └─ list.js
│       └─ …
├─ public/
│   └─ index.html
├─ src/
│   ├─ components/
│   ├─ pages/
│   │   ├─ Login.jsx
│   │   ├─ Register.jsx
│   │   ├─ StudentDashboard.jsx
│   │   └─ TeacherDashboard.jsx
│   ├─ App.jsx
│   └─ main.jsx
├─ .env                  # local env for Vite
├─ vercel.json           # rewrite rules for SPA fallback
├─ package.json
└─ README.md             # ← you are here

````

---

## 🔧 Prerequisites

- **Node.js** >= 16.x  
- **npm** >= 8.x  
- A **MongoDB Atlas** cluster (or local MongoDB)  
- A **Vercel** account  

---

## ⚙️ Local Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your‑username/student‑teacher‑appointment.git
   cd student‑teacher‑appointment
```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` in project root**

   ```env
   VITE_BACKEND_URL=http://localhost:3000/api/v1
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   ```

4. **Run in development**

   ```bash
   npm run dev
   ```

   * Frontend: `http://localhost:5173/`
   * API (via Vercel dev): `http://localhost:3000/api/v1/...`

---

## 📦 Production Build & Deploy

### 1. Vercel Configuration

* Install the **Vercel CLI** (optional):

  ```bash
  npm install -g vercel
  ```
* Create a `vercel.json` at project root:

  ```jsonc
  {
    "version": 2,
    "builds": [
      { "src": "src/main.jsx", "use": "@vercel/static-build", "config": { "distDir": "dist" } },
      { "src": "api/**/*.js",      "use": "@vercel/node" }
    ],
    "routes": [
      { "src": "/api/(.*)", "dest": "/api/$1" },
      { "src": "/(.*)",     "dest": "/index.html" }
    ]
  }
  ```

### 2. Environment Variables (Vercel Dashboard)

| Key                | Value                                         |
| ------------------ | --------------------------------------------- |
| `MONGO_URI`        | your‑mongodb-connection-string                |
| `JWT_SECRET`       | your‑secret-key                               |
| `VITE_BACKEND_URL` | `https://<your-vercel-app>.vercel.app/api/v1` |

### 3. Deploy

From your project root:

```bash
vercel --prod
```

Or push to GitHub with Vercel’s Git integration.

---

## 🧪 Testing

* **Unit & integration tests** (if implemented)

  ```bash
  npm test
  ```

* **Manual**

  1. Register as **Student**, log in, book a slot
  2. Register as **Teacher**, set availability, approve booking
  3. Verify toast notifications and app navigation

---

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "Add YourFeature"`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

> Built with ❤️ by Vivek Yadav

```
```

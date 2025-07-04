# 📚 Class Management System

## Overview

The **Class Management System (CMS)** is a comprehensive web platform designed to streamline classroom operations and communication. It offers a multi-role environment for students, class representatives (CRs), class administrators (CAs), and system administrators to manage notices, attendance, materials, voting, and more.

Built with a powerful tech stack — **Node.js**, **Express.js**, **MongoDB**, and **React.js** — the CMS ensures a dynamic and responsive user experience. It also supports offline capabilities through **Progressive Web App (PWA)** implementation and is built with scalability and modularity in mind.

---

## 🚀 Features (Ongoing)

| Feature                     | Description                                         |
| --------------------------- | --------------------------------------------------- |
| ✅ Noticeboard               | Centralized space for class announcements.          |
| ✅ Student List              | Maintains a roster of enrolled students per class.  |
| ✅ Subject Materials         | Upload and categorize study materials by subject.   |
| ⏳ Class Photos              | Share and organize class memories and event photos. |
| ⏳ Class Historical Timeline | Track key milestones and events over time.          |
| ⏳ Push Notifications        | Allow CRs to instantly notify students.             |
| ⏳ Voting System             | Conduct polls, elections, or feedback collection.   |
| ⏳ Auto Attendance Tracker   | Monitor and alert students with low attendance.     |
| ⏳ Feedback Collector        | Collect anonymous or named feedback from students.  |
| ⏳ Exam Schedules            | Post and manage exam timetables.                    |
| ⏳ Events & Hackathons       | Organize and promote academic or social events.     |
| ⏳ Class Honors List         | Recognize top-performing students.                  |
| ⏳ Past Year Questions       | Archive previous exam questions for reference.      |

---

## 👥 User Roles

| Role            | Privileges                                                        |
| --------------- | ----------------------------------------------------------------- |
| **Student**     | Access materials, notices, participate in votes, view attendance. |
| **CR**          | Post notices, send notifications, manage class content.           |
| **CA**          | Appoint CRs, manage faculty assignments.                          |
| **Admin**       | Manage multiple classes and administrators.                       |
| **Super Admin** | Full access across the system.                                    |

**Further roles can be crated further or removed  as we identify the requirements during the development process**

---

## 🛠 Tech Stack

### Backend

* **Node.js** + **Express.js**: RESTful API development
* **MongoDB**: NoSQL document-based data storage
* **Firebase Auth** : For user authentication

### Frontend

* **React.js**: Component-based UI, Material UI
* **HTML5/CSS3/JavaScript**
* **Axios**: API requests handling

### Other Tools

* **Cloud Storage**: Cloudinary
* **PWA Support**: For offline capabilities and installable experience (planned)
* **Docker** (Planned): Containerized deployment for all services
* **Microservices Architecture** (Planned): Modular services for scalability (planned)

---

## 📱 Progressive Web App (PWA)

This project is PWA-enabled, ensuring:

* Offline functionality
* Fast loading times
* Native app-like experience on both desktop and mobile

---

## 🔌 API Development

The backend APIs are developed using Express.js and follow a RESTful pattern. Authenticated routes are protected via firebase auth, with role-based access control (RBAC) ensuring secure endpoint access.


---

## 📂 File Management

* Firebase auth
* CDN integration for faster content delivery (planned)
* Secure, private access for authorized users only

---

## 🧠 Smart Automation (Future Scope)

An agent-based system will be integrated to:

* Read WhatsApp messages sent to CRs
* Automatically parse and post content via backend APIs
* Reduce manual overhead and streamline communication

---

## 🐳 Future Enhancements

* **Dockerization**: Container-based deployment for backend, frontend, and services.
* **Microservices**: Refactor system into isolated services for authentication, file management, voting, etc.
* **Real-time Features**: Integration of WebSockets for live updates and notifications.

---

## 🧾 Installation & Setup

### Prerequisites

* Node.js & npm
* MongoDB
* Git

### Steps

1. **Clone the repository**

   ```bash
   https://github.com/ShudarsanRegmi/ClassMgmtSysOS-.git
   cd ClassMgmtSysOS-
   ```

2. **Install backend dependencies**

   ```bash
   cd backend-classmgmt
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd frontend-classmgmt
   npm install
   ```

4. **Environment setup**
   Create a `.env` file in both backend and frontend directories with necessary credentials (MongoDB URI, firebase api keys, etc.).

**Backend .env**
```
PORT=3001
MONGO_URI=mongodburl
CLOUD_NAME=cloudname
CLOUD_API_KEY=cloud_api_key
CLOUD_API_SECRET=cloud_secret
```

**Frontend .env**
```
PORT=3001
MONGO_URI=mongodburl
CLOUD_NAME=cloudname
CLOUD_API_KEY=cloud_api_key
CLOUD_API_SECRET=cloud_secret
```

**Frontend .env**

```
FIREBASE_API_KEY=firebase_api_key
BASE_URL=localhost:5173
VITE_APP_ENV=development
```

5. **Run the app**

   ```bash
   cd frontend-classmgmt
   npm run dev

   # Frontend
   cd frontend-classmgmt
   npm run dev
   ```

---

## 🧑‍💻 Contributing

We welcome contributions from the community!

* Fork the repository
* Create a new branch (`feature/my-feature`)
* Commit your changes
* Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---


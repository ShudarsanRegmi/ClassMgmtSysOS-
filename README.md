# 📚 Class Management System

![image](https://github.com/user-attachments/assets/a956b1fd-943d-4a4d-aac2-1d6a5c002a95)
![image](https://github.com/user-attachments/assets/1e490cd3-e330-49cd-9bb5-0db848f63861)
![image](https://github.com/user-attachments/assets/5559f55f-ba3f-4936-8879-fc40fda36c4d)


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

## 📁 Project Structure

```bash
ClassMgmtSysOS-/                       
├── backend-classmgmt/
│         ├── config/
│         ├── controllers/
│         ├── dtos/
│         ├── middleware/
│         ├── models/
│         ├── routes/
│         ├── services/
│         ├── utils/
│         ├── app.js
│         ├── firebaseAdmin.js
│         ├── nodemon.json
│         ├── package-lock.json
│         ├── package.json
│         └── swaggerOptions.js       
├── frontend-classmgmt/
│         ├── cypress/
│         ├── public/
│         ├── src/
│         ├── .gitignore
│         ├── README.md
│         ├── cypress.config.js
│         ├── eslint.config.js
│         ├── index.html
│         ├──  muiTheme.js
│         ├──  package-lock.json
│         ├──  package.json
│         ├── tailwind.config.js
│         └── vite.config.js                                   
├── CODE_OF_CONDUCT.md            
├── CONTRIBUTING.md          
├── LICENSE              
├── SECURITY.md                                               
└── README.md          
          

```

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

**Firebase ServiceAccountKey.md**

Create `serviceAccountKey.json` at the root of `backend-classmgmt`

```
{
    "type": "service_account",
    "project_id": "classmgmt-xxxx",
    "private_key_id": "6284ed185a40xxxxxxxxe82b0d381207686012",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIx0jYRJAxxxxxxxxCSjhYS9BS+N/d5C1qC\nGplfQMlp1iZt/zXmXyM0Ir/8ERq97AIorU2T5lYIZs7tnhKvpQDwK8NDARrHPkfz\nCrg88exLqgwKgJCewYMMTBfwVsOUPJYfPodAlMmqB/tiTfB/lv/2/BhSv/BBdofi\n0FP3uKSQFFjcGak75Hk/JQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-axxxxx-fbsvc@cxxxx7d.iam.gserviceaccount.com",
    "client_id": "xxxxxxxx",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40classmgmt-aa87d.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  

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


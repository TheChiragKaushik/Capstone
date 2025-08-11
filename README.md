# MedicationManagementTool - Setup and Usage Guide

This guide will walk you step-by-step through downloading, installing, and setting up the development environment for the **MedicationManagementTool** project.  

The project consists of:
- **Backend**: Spring Boot microservices  
- **Frontend**: React (Vite)  
- **Database**: MongoDB

You will also learn how to import MongoDB collections and run the project locally.

---

## 1. Prerequisites

### Tools to Install
- **[Spring Tool Suite (STS)](https://spring.io/tools)** → For backend development (Spring Boot microservices)
- **[Visual Studio Code (VS Code)](https://code.visualstudio.com/)** → For frontend development (React with Vite)
- **MongoDB** → Database server installed and running locally or remotely
- **Node.js & npm** → For running the frontend

---

## 2. Download and Install STS (For Spring Boot Backend)

1. Visit the official Spring Tool Suite website: [https://spring.io/tools](https://spring.io/tools)  
2. Download the latest version of STS for your operating system (Windows/macOS/Linux).  
3. Install STS following the installation instructions.  
4. Launch STS to make sure it’s working properly.

---

## 3. Download and Install Visual Studio Code (For React Frontend)

1. Visit the VS Code website: [https://code.visualstudio.com/](https://code.visualstudio.com/)  
2. Download and install VS Code for your operating system.  
3. Launch VS Code.  
4. (Optional but recommended) Install these extensions:
   - **ESLint**
   - **Prettier**
   - **React Snippets**
   - **Vite Support** (optional)

---

## 4. Clone the Project from GitHub

Open a terminal or command prompt and run:

git clone **[Capstone](https://github.com/TheChiragKaushik/Capstone)**  (https://github.com/TheChiragKaushik/Capstone)

cd MedicationManagementTool


## 5. Import MongoDB Collections

Before starting the backend services, import the MongoDB collections from the `MongoDBCollections` folder in this project.

1. Open **MongoDB Compass** or use the Mongo shell.
2. Import the following JSON files into collections with these exact names:
   - `alarmringtones` → from `alarmringtones.json`
   - `allergies` → from `allergies.json`
   - `medications` → from `medications.json`
3. Make sure all collections are created in the **same database** that your backend services are configured to use.

---

## 6. Open Project Folders

- In **Spring Tool Suite (STS)**  
  Open the `Backend` folder → contains all your **Spring Boot microservices**.

- In **VS Code**  
  Open the `Frontend` folder → contains your **React + Vite frontend**.

---

## 7. Configure Port Numbers (Optional)

If you want to change the port number for any microservice:

- For **all backend microservices except API Gateway**:  
  Go to `src/main/resources/application.properties` and edit:
  server.port=XXXX

- For the **API Gateway microservice**:  
Go to `src/main/resources/application.yml` and update the `server.port` property.

---

## 8. Setup Frontend Dependencies

Open a terminal in the `Frontend` folder and run:

npm install

This will install all the required dependencies for the Vite + React frontend.

---

## 9. Starting the Application

### Backend
- In STS, **Run** each Spring Boot microservice by starting its **main class**.
- Make sure **all microservices are running**.

### Frontend
In the `Frontend` folder terminal, run:

npm run dev

This will start the React frontend with **Vite’s development server**.

---
## 10. Accessing API Swagger UI
Once the backend services are running, you can access the API Swagger documentation at:

(http://localhost:8989/webjars/swagger-ui/index.html)

This provides a convenient interface to explore and test the backend APIs.

---

## 11. Summary Table

| Step | Details |
|------|---------|
| 1. Install STS | For Spring Boot microservices |
| 2. Install VS Code | For React frontend |
| 3. Clone repo from GitHub | `git clone <repo-url>` |
| 4. Import MongoDB collections | `alarmringtones`, `allergies`, `medications` from JSON files |
| 5. Open backend in STS | Open `/Backend` folder |
| 6. Open frontend in VS Code | Open `/Frontend` folder |
| 7. Configure ports if needed | Update `application.properties` or `application.yml` |
| 8. Install frontend dependencies | Run `npm install` in `/Frontend` |
| 9. Start backend services | Run microservices in STS |
| 10. Start frontend | Run `npm run dev` in `/Frontend` |

---

## ✅ You’re All Set!

Following these steps will get your **MedicationManagementTool** project running locally.  
If you face any issues:
- Double-check MongoDB connection settings
- Ensure all backend ports are available  
- Check console logs for frontend and backend for errors

---

**Author:** Chirag Kaushik  
**Repository:** (https://github.com/TheChiragKaushik/Capstone)


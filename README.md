# 🚀 Social Media App (Microservices Architecture)

A scalable **Social Media Backend** built using **Node.js**, following a **Microservices Architecture** pattern for modularity, scalability, and maintainability.

This project demonstrates how to structure and connect multiple independent services through **API Gateway** and **message queues (RabbitMQ)** — ensuring smooth inter-service communication, event-driven data flow, and fault tolerance.

---

## 🏗️ Architecture Overview

This application is composed of multiple **independent microservices**, each responsible for a specific domain of the app.


Each service runs independently, has its own **database**, and communicates via **RabbitMQ** and **HTTP requests**.  
This design ensures scalability, fault isolation, and efficient asynchronous processing.

---

## ⚙️ Technologies Used

**Core Stack**
- 🟢 **Node.js** – Runtime environment for all backend services  
- 🧱 **Express.js** – Web framework for RESTful APIs  
- 🐇 **RabbitMQ** – Message broker for inter-service communication (Pub/Sub architecture)  
- 🗄️ **MongoDB** – NoSQL database for scalable and fast data access  
- 🧩 **Redis (optional)** – Caching layer to improve query performance  
- ☁️ **Cloudinary** – For media storage and image hosting  
- 🔐 **JWT** – For secure user authentication  
- 🧰 **Winston / Custom Logger** – Centralized structured logging  

---

## 🧠 Services Breakdown

### 🧩 1. API Gateway
Handles all incoming client requests and routes them to the appropriate microservice.  
Includes authentication, centralized error handling, and logging middleware.

**Key Features:**
- Authentication middleware  
- Centralized error handling  
- Proxy routing to microservices  
- Logging with Winston  

**Main Files:**
api-gateway/
├── src
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── errorHandler.js
│ ├── utils/logger.js
│ └── server.js

---

### 🔐 2. Identity Service
Manages user authentication, registration, and token generation (JWT & Refresh tokens).

**Key Features:**
- User registration and login  
- Refresh token mechanism  
- Input validation  
- Database connection handling  
- Error middleware and structured logging  

**Main Files:**
identity-service/
├── src
│ ├── controllers/identity-controller.js
│ ├── models/User.js
│ ├── models/RefreshToken.model.js
│ ├── utils/generateToken.js
│ ├── utils/validation.js
│ ├── routes/identityService.routes.js
│ └── server.js


---

### 🖼️ 3. Media Service
Handles all image and video uploads with Cloudinary and manages media-related events.

**Key Features:**
- Upload images/videos to Cloudinary  
- Event-based communication with RabbitMQ  
- Auth middleware for upload access  
- Centralized error handling  

**Main Files:**
media-service/
├── src
│ ├── controllers/media-controller.js
│ ├── models/Media.js
│ ├── utils/cloudinary.js
│ ├── utils/rabbitmq.js
│ ├── eventHandlers/media-event-handler.js
│ └── server.js


---

### 📝 4. Post Service
Manages creation, deletion, and fetching of posts.  
Handles cache invalidation, validation, and event emission for search updates.

**Key Features:**
- Create, update, delete posts  
- Data validation  
- RabbitMQ events for search updates  
- Caching and invalidation utilities  
- Error handling middleware  

**Main Files:**
post-service/
├── src
│ ├── controllers/postController.js
│ ├── models/Post.js
│ ├── utils/invalidateCache.js
│ ├── utils/rabbitmq.js
│ ├── utils/logger.js
│ ├── routes/post-routes.js
│ └── server.js


---

### 🔎 5. Search Service
Provides full-text search capabilities using MongoDB’s text indexes.  
Keeps the search index updated through RabbitMQ events from post-service.

**Key Features:**
- Full-text search using `$text` and `$meta: textScore`  
- Handles events to update search data  
- Auth middleware and centralized error handling  
- Logging for search operations  

**Main Files:**
search-service/
├── src
│ ├── controllers/search-controller.js
│ ├── eventHandlers/search-event-handler.js
│ ├── models/Search.js
│ ├── utils/rabbitmq.js
│ ├── routes/search-routes.js
│ └── server.js


---

## 🧩 Inter-Service Communication
All services communicate asynchronously using **RabbitMQ**.  
For example:
- When a new post is created, the **Post Service** sends an event to RabbitMQ.
- The **Search Service** consumes that event and updates its search index accordingly.

This event-driven approach ensures **loose coupling** and **high scalability**.

---

## 🧱 Architecture Highlights

✅ **Microservices Pattern** – Independent and modular backend design  
✅ **Scalable Messaging System** – RabbitMQ for inter-service communication  
✅ **Secure Authentication** – JWT and Refresh Token mechanism  
✅ **Centralized Logging** – Winston/Custom logger integrated across all services  
✅ **Error Handling Middleware** – Consistent error responses  
✅ **Cloud Storage** – Cloudinary for media management  
✅ **Text Search Indexing** – MongoDB `$text` for fast and relevant search  
✅ **Clean Code Organization** – Follows industry best practices  

---

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/gauravdotiyal/Backend-II

   


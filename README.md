# Rental Booking App 

An Airbnb-style rental listing platform built using the **MERN stack**, featuring authentication, listing management, and image uploads.

Live Preview: 
✅ https://airbnb-k3zu.onrender.com/listings
---

## 🚀 Features

- User authentication using Passport.js
- Create, update, and delete rental listings
- Image uploads with Cloudinary
- Secure session management
- Responsive UI
- RESTful backend architecture

---

## 🧠 Tech Stack

- **Frontend:** EJS, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** Passport.js  
- **Image Storage:** Cloudinary  

---

## ⚙️ Project Setup

### Clone the repository
```bash
git clone https://github.com/Abhishek-3191/airbnb.git
cd airbnb
Install dependencies
bash
Copy code
npm install
Environment Variables
Create a .env file and add:

env
Copy code
PORT=3000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SESSION_SECRET=your_session_secret
Run the application
bash
Copy code
node app.js
🧩 Challenges & Solutions
1️⃣ Authentication & Session Management
Challenge:
Implementing secure user authentication and maintaining sessions across requests.

Solution:
Used Passport.js with session-based authentication, along with secure cookie handling and environment-based session secrets to ensure user security.

2️⃣ Image Upload & Storage
Challenge:
Handling large image uploads efficiently without overloading the server.

Solution:
Integrated Cloudinary to offload image storage, allowing direct uploads and secure image URLs stored in MongoDB.

3️⃣ Data Modeling & Relationships
Challenge:
Designing a scalable schema for listings and users while maintaining data consistency.

Solution:
Designed normalized Mongoose schemas with references, enabling efficient querying and future feature expansion.

4️⃣ Error Handling & Validation
Challenge:
Preventing invalid data entry and handling runtime errors gracefully.

Solution:
Implemented centralized error-handling middleware and server-side validations to improve reliability and user experience.

5️⃣ Application Scalability
Challenge:
Ensuring the backend remains maintainable as features grow.

Solution:
Adopted a modular MVC architecture with clear separation of routes, controllers, and models.

📁 Project Structure
pgsql
Copy code
controllers/   – Business logic
models/        – Mongoose schemas
routes/        – Express routes
views/         – EJS templates
public/        – Static assets
utils/         – Helper functions
🔮 Future Improvements
Booking and payment integration

Review and rating system

Map-based listing search

Admin analytics dashboard

👨‍💻 Author
Abhishek Srivastava
🔗 GitHub: https://github.com/Abhishek-3191
🔗 Portfolio: https://abhishek-srivastava.vercel.app/




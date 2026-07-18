# StayNest 🏡

A full-stack vacation rental platform inspired by Airbnb, built with **Node.js, Express.js, MongoDB, and EJS**. StayNest allows users to discover unique stays, create and manage property listings, upload images, explore locations using interactive maps, and share experiences through reviews.

### 🔗 Live Demo
https://stay-nest-kse6.onrender.com
<img width="1531" height="777" alt="Home png" src="https://github.com/user-attachments/assets/be306f6d-bdbe-411b-9cd9-1ef1e0d48775" />

---

## Features

- Secure user registration and login
- Authentication and authorization with Passport.js
- Create, edit, and delete property listings
- Upload property images using Cloudinary
- Interactive maps with MapTiler
- Add and manage reviews
- Search listings
- Responsive user interface
- Server-side validation using Joi
- Session management with MongoDB

---

## Tech Stack

**Frontend**
- HTML5
- CSS3
- Bootstrap
- EJS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose

**Authentication**
- Passport.js
- Express Session
- Connect-Mongo

**Cloud Services**
- Cloudinary
- MapTiler

**Deployment**
- Render

---

## Project Structure

```
StayNest
├── controllers
├── models
├── routes
├── views
├── public
├── utils
├── middleware.js
├── app.js
├── schema.js
└── package.json
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/nidashaikh0907/StayNest.git
```

Move into the project directory

```bash
cd StayNest
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
ATLASDB_URL=your_mongodb_connection_string

SECRET=your_secret_key

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_maptiler_api_key
```

Start the application

```bash
node app.js
```

Open your browser

```
http://localhost:8080/listings
```

---

## Future Improvements

- Booking system
- Wishlist functionality
- Online payment integration
- User dashboard
- Email verification
- Advanced search and filters

---




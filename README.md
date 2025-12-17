## AnimeVault  / MERN Project

Author: Nuria Gómez

### Description

AnimeVault is a MERN project focused on cataloging and tracking anime series. It features a detailed anime library where users can explore entries, read and leave comments on each anime. While user ratings were planned, the final version only supports text-based comments.
AnimeVault also includes login and registration functionality, ensuring personalized tracking of watched anime.

### To launch AnimeVault 

➟ Download the backend from repository: [Backend Repo Link]

➟ Run `npm install` and `npm run dev` on the server side.

➟ Download the frontend from repository: [Frontend Repo Link]

➟ Run `npm install` and `npm start` on the client side.



---

## Technologies 

### Front-End 

➟ JavaScript (React v19.2.0).

➟ React Router v7.9.5 for navigation.

➟ React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, etc.) for UI testing.

➟ web-vitals for performance metrics.

➟ Proxy configuration for backend API calls during development.

### Back-End 

➟ NodeJS and Express for API development.

➟ MongoDB and Mongoose for database management.

➟ Authentication with bcryptjs / bcrypt and JSON Web Tokens (JWT).

➟ Email functionality with Nodemailer.

➟ CORS enabled for cross-origin requests.

---

### Notes 

* Rating system was removed; only text comments are available.
* Error handling pages (like 404) can be added for a more complete UX.
* All core CRUD operations are implemented for anime entries.


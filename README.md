# GetHotel

**A full-stack hotel discovery and booking application** built with React, Express, and MongoDB. Guests can search hotels by destination, dates, and party size, reserve rooms, and pay through Stripe. Administrators can manage the hotel, room, user, and booking data behind a role-protected dashboard.

## Highlights

- Search hotels by location, check-in/check-out dates, number of rooms, and travellers.
- Browse hotel and room details, including descriptions, specifications, and photos.
- Create an account, manage a profile, and view personal bookings.
- Book rooms for selected dates and complete payment through Stripe Payment Intents.
- Prevent reservations for dates already marked unavailable.
- Upload and manage hotel and room images with Cloudinary.
- Admin dashboard for managing hotels, rooms, users, and bookings, including booking status updates.
- Cookie-based JWT authentication with separate user and administrator access.
- Responsive React interface with Redux Toolkit state management.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 18, React Router, Redux Toolkit, Material UI, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JWT, HTTP-only cookies, bcryptjs |
| Payments | Stripe |
| Image storage | Cloudinary |

## How it fits together

The React client communicates with the Express REST API under `/api/v1`. The API persists users, hotels, rooms, and bookings in MongoDB; Cloudinary stores uploaded images; and Stripe handles payment intents. Authentication is maintained with a JWT in an HTTP-only cookie, while backend middleware protects signed-in and admin-only routes.

```text
frontend/  React application
    │  Axios requests (credentials included)
    ▼
backend/   Express REST API ───── MongoDB
    ├─────────────────────────── Cloudinary (images)
    └─────────────────────────── Stripe (payments)
```

## Run locally

### Requirements

- Node.js and npm
- A MongoDB database (local or hosted)
- Cloudinary credentials for image uploads
- Stripe API keys for payment flows

### 1. Install dependencies

From the repository root:

```bash
npm install
npm install --prefix frontend
```

### 2. Configure the backend

Create `backend/config/config.env`. This file is intentionally ignored by Git; do not commit real credentials.

```dotenv
PORT=5000
NODE_ENV=development
DB_URI= your_db_uri
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:3000

CLOUDINARY_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

STRIPE_API_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
```

Use your own MongoDB connection string and service credentials. Stripe's publishable and secret keys must belong to the same Stripe account. Booking Payment Intents are currently created in **BDT**.

### 3. Start the API and web app

Run each process in a separate terminal from the repository root:

```bash
npm run dev
```

```bash
npm start --prefix frontend
```

The API is available at `http://localhost:5000`; the React development server is available at `http://localhost:3000`. The frontend uses `http://localhost:5000` by default. To point it at another API origin, create `frontend/.env` and set:

```dotenv
REACT_APP_API_URL=https://your-api.example.com
```

If the frontend origin changes, update `FRONTEND_URL` in the backend configuration as well. Multiple allowed origins can be supplied as a comma-separated list.

### First administrator

Newly registered accounts receive the `user` role. To access admin-only screens and API routes, promote an account's `role` to `admin` in your MongoDB database using a trusted administrative workflow. Do not expose database credentials or enable public self-registration as an admin.

## API overview

All routes below are prefixed with `/api/v1`. Routes marked **Signed in** require authentication; **Admin** routes additionally require the `admin` role.

| Area | Routes | Access |
| --- | --- | --- |
| Health | `GET /health` | Public |
| Authentication | `POST /user/new`, `POST /login`, `GET /logout`, `GET /me` | Sign up/login/logout are public; `/me` is signed in |
| Account | `PUT /me`, `DELETE /me`, `PUT /me/password` | Signed in |
| Hotel search | `GET /hotels`, `GET /hotel/:id` | Public |
| Hotel management | `POST /hotel/new`, `PUT /hotel/:id`, `DELETE /hotel/:id`, `PUT /hotel/:id/images` | Admin |
| Rooms | `GET /hotel/:id/rooms`, `GET /room/:id` | Public |
| Room management | `POST /hotel/:id/room/new`, `PUT /room/:id`, `DELETE /room/:id`, `PUT /room/:id/images` | Admin |
| Bookings | `POST /hotel/:id/:room/book`, `GET /me/bookings`, `GET /me/booking/:id` | Signed in |
| Booking administration | `GET /bookings`, `GET /booking/:id`, `PUT /booking/:id` | Admin |
| User administration | `GET /admin/users`, `GET /admin/user/:id`, `PUT /admin/user/:id` | Admin |
| Stripe | `GET /stripeapikey`, `POST /stripeclientkey` | Signed in |

Hotel search accepts optional query parameters: `location`, `room`, `person`, `d1`, and `d2` (dates formatted as `YYYY-MM-DD`). For example:

```text
GET /api/v1/hotels?location=Dhaka&room=1&person=2&d1=2026-12-10&d2=2026-12-12
```

## Production build

Build the React app from the repository root:

```bash
npm run production
```

This installs the frontend dependencies and creates `frontend/build`. Set the backend's `NODE_ENV` to `production`, configure the production `FRONTEND_URL` and service credentials, then start the backend with:

```bash
npm start
```

When the production build exists, the Express app serves it alongside the API. Deploy the backend and built frontend with secure production secrets, HTTPS, and appropriately restricted database and service access.

## Repository layout

```text
backend/
  config/       MongoDB connection and local environment configuration
  controllers/  Request handlers for users, hotels, rooms, and bookings
  middlewares/  Authentication, image upload, and error handling
  models/       Mongoose schemas
  routes/       Express API routes
  utils/        Shared response, error, and image helpers
frontend/
  src/
    components/ Shared UI components
    redux/      Store, actions, and slices
    screens/    Guest, booking, and admin pages
    utils/      API configuration and route helpers
```

# Mini_Media -mini social media platform

A mern-stack mini social media platform created for Emilo Assignment. Includes Registration/Login , JWT protected APi, profile editing, a post feed ,likes and follow/unfollow.

# Tech

- Frontend: React, Vite, React Router, Axios, Tailwind css
- Backend: Node.js , Express, JWT, Bcryptjs
- database: MOngoDb, Mongoose
- Validation: Zod

# Requirements

-Node,js
-MongoDb

# Setup

1. Backend
   '''''Terminal
   cd backend
   npm install  
    set .env files
   Run-

# npm run dev

2. Frontend
   '''''Terminal
   cd Frontend
   npm intsall
   set .env files
   Run-

# npm run dev

### Authentication

# Method -----------Endpoint-------------Description

POST---------'/auth/regsiter'---------register with name,email,password
POST---------'/auth/login'----------LOG IN
GET---------'/auth/me'-------------Current authenticated user

### Users

# Method -----------Endpoint-------------Description

GET---------'/users'---------list of all users
GET---------'/users/:id'---------view a users profile
PATCH---------'/users/me'---------update name,bio,profile picture(email not editable)
POST ------------- '/users/:id/follow'-------folow/unfollow a users

### Posts

# Method----------------Endpoint-----------------Description

GET----------------'/posts'------------------get feed
GET----------------'/posts/mine'-------------Get current users posts
POST----------------'/posts'-------------Create a text and image-file post
POST----------------'/posts/:id/like'-------------Like unlike post
DELETE----------------'/posts/:id'-----------Delete own posts only : 403 error

### Validation

- Name : min 3 char
- Email : valid email format, unique at registration
- password : min 6 char(hashed with bcrypt before store in DB)
- profile filed : email (read-Only)
- server validation : zod schema

## Image handling

profile picture and post image are selected as local files, cropped in the browser with "react-easy-crop" and "react-image-crop", upload through multer, and stored in cloudinary, image limit size to 5mb and accepts format JPG,PNG,WEBP and GIF

## Security

- never commit env files
- use long random "JET_SECRET"
- use validator
- authentication
- password hashing
- protected routes
- Email (read-only)
- zod Schema
- JWT authentication

## NPM package

BACKEND--------

- exprees
- mongoose
- dotenv
- jsonwebtoken
- bcrypt
- nodemon
- zod
- multer
- cloudinary
- cors

FRONTEND-----------

- vite@latest
- lucide-react
- react-routed-dom
- axios
- react-image-crop
- react-easy-crop
- multer
- cloudinary

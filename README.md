# Recipe Book

Recipe Book is a full-stack application for browsing recipes, creating and sharing recipes, organizing recipes by category, and managing favorites. The home page shows recipe previews publicly; signing in is required to view full recipe details and use account features.

## Technology

- **Frontend:** React, Vite, React Router, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT access and refresh tokens
- **Image uploads:** Multer and Cloudinary

## Project structure

```text
BackEnd/
  src/
    controllers/   Request handlers
    DB/            MongoDB connection
    middlewares/   Authentication and multipart uploads
    models/        Mongoose schemas
    routes/        Versioned API routes
    utils/         API helpers and Cloudinary integration
FrontEnd/
  src/
    components/    Shared UI
    pages/         Home, My Recipes, categories, favorites, and details
    services/      API calls
    store/         Redux store and authentication state
```

## Requirements

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas connection string
- Cloudinary credentials to upload recipe images, avatars, or cover images

## Configuration

Create `BackEnd/.env`:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=replace-with-another-long-random-secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

The backend selects the `RecipeBook` database. For MongoDB Atlas, set `MONGO_URI` to your Atlas connection string. Keep secrets private and do not commit `.env` files.

Cloudinary variables are needed for image uploads. Recipe images are optional.

Create `FrontEnd/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Restart Vite after changing frontend environment variables.

## Run locally

Install and run the backend in one terminal:

```bash
cd BackEnd
npm install
npm start
```

Install and run the frontend in another terminal:

```bash
cd FrontEnd
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The backend listens on port `3000` by default and connects to MongoDB before starting.

## Backend API

All API routes are prefixed with `/api/v1`.

Recipe tags are synchronized into the categories collection when recipes are created and when the category list is requested. This also fills categories from existing recipes.

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/users/register` | No | Register with `username`, `email`, and `password`; optional `avatar` and `coverImage` files |
| `POST` | `/users/login` | No | Log in with `email` or `username` and `password` |
| `GET` | `/users/auth/me` | Yes | Get the current user |
| `POST` | `/users/logout` | Yes | Log out |
| `POST` | `/users/refresh-token` | Refresh token | Refresh the access token |
| `GET` | `/recipes?page=1&limit=20` | No | Get paginated recipe previews |
| `GET` | `/recipes/:id` | Yes | Get full recipe details |
| `GET` | `/recipes/mine` | Yes | Get recipes created by the current user |
| `POST` | `/recipes` | Yes | Create a recipe; optional image file field is `image` |
| `PUT` | `/recipes/:id` | Yes | Update a recipe owned by the current user |
| `DELETE` | `/recipes/:id` | Yes | Delete a recipe owned by the current user |
| `GET` | `/categories` | No | List categories |
| `GET` | `/categories/:id` | No | Get a category and its recipe previews |
| `POST` | `/categories` | Yes | Create a category |
| `PUT` | `/categories/:id` | Yes | Update a category |
| `DELETE` | `/categories/:id` | Yes | Delete a category |
| `GET` | `/favorites` | Yes | List the current user's favorites |
| `POST` | `/favorites/:recipeId` | Yes | Add a recipe to favorites |
| `DELETE` | `/favorites/:recipeId` | Yes | Remove a recipe from favorites |

For authenticated requests, send the access token as `Authorization: Bearer <token>` or use the authentication cookie.

To create a recipe with Postman, use **Body → form-data**. Send `title`, `description`, and JSON-encoded `tags`, `ingredients`, and `steps` fields; optionally add an `image` field of type **File**. For example:

```text
tags: ["dinner"]
ingredients: [{"name":"Rice","quantity":"1 cup"}]
steps: ["Rinse the rice","Cook until tender"]
```

## Frontend scripts

Run these commands from `FrontEnd/`:

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Contributing

Contributions are welcome. Open an issue or pull request with a clear description of the proposed change.

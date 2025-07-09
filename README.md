# Recipe Book

**Recipe Book** is a React-based web application that lets users explore, search, and favorite various recipes. It uses Appwrite for backend services (authentication, database, storage), Tailwind CSS for styling and React Router for navigation.

---

## 🚀 Features

- **User Authentication**: Sign up, log in, and log out via Appwrite Accounts.
- **Browse Recipes**: View all recipes in a responsive card grid.
- **Recipe Details**: Click on the card to see full recipe information, including images, ingredients and optional video links.
- **Favorites**: Mark recipes as favorites; view and manage your personal favorites list.
- **Categories**: Browse categories and view recipes filtered by category.
- **Legal & Info Pages**: About Us, Contact Us form, Privacy Policy, and Terms of Service.

---

## 📁 Folder Structure

```plaintext
src/
├── appwrite/           # Appwrite service wrappers (config.js, auth.js)
├── components/         # Reusable components (Header, Footer, container, etc.)
├── conf/               # Configuration (conf.js reads from .env)
├── pages/              # Route views (Home, Recipes, RecipeDetail, Categories, CategoryDetail, Favorites)
├── store/              # Redux slices (authSlice, store)
├── App.jsx             # Layout setup(Header, Outlet, Footer)
└── main.jsx            # React DOM entry point and main router setup
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bitm0rph/Recipe-Book.git
   cd Recipe-Book
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the project root
   ```env
    VITE_APPWRITE_URL="https://fra.cloud.appwrite.io/v1"
    VITE_APPWRITE_PROJECT_ID="686a301f00321dd9cf0b"
    VITE_APPWRITE_DATABASE_ID="686a3132002ba40583b0"
    VITE_APPWRITE_COLLECTION_ID="686a316c003213180b82"
    VITE_APPWRITE_FAVORITE_COLLECTION_ID="686d3356003c3a740a0d"
    VITE_APPWRITE_CATEGORIES_COLLECTION_ID="686d5d27002ef28d00a2"
    VITE_APPWRITE_BUCKET_ID="686a34240029fcc0e032"
   ```

4. **Run development server**
   ```bash
   npm run dev   # or yarn dev
   ```

5. **Open in browser**:
   Visit `http://localhost:5173`  to view the app.

---

## 🔗 Useful Scripts

- `npm run dev` / `yarn dev`: Start Vite development server
- `npm run build` / `yarn build`: Bundle for production
- `npm run preview` / `yarn preview`: Preview production build

---

## 🛠 Appwrite Setup

1. **Create a Project** in Appwrite Console.
2. **Enable Email/Password Authentication** under Accounts.
3. **Create Database & Collections**:
   - **Recipes** collection with attributes: `title`, `content`, `description`, `Category`, `Ingredients`, `image`, `video` with an index on `Category`.
   - **Favorites** collection with attributes: `userId`, `recipeId` plus an index on `userId`.
   - **Categories** collection with attribute: `name` containing an index.
4. **Set Create, Read** and **Delete Permissions** when creating Favorites.
5. Of course, **Recipes** and **Categories** will need **Read Permission**.
   
6. **Whitelist your origin** under **Settings → Web**.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests to suggest improvements or new features.

---

## 📄 License

This project is licensed under the MIT License.

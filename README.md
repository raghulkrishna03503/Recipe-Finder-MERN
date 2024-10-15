# Recipe Finder Application

This project is a full-stack Recipe Finder application where users can search for recipes, filter them by area, and sort by the number of ingredients. Users can also save their favorite recipes to a personal collection. The app is built using React for the frontend and Node.js with Express and MongoDB for the backend.

## Features

- Search for recipes by name
- Filter recipes by area of origin
- Sort recipes by the number of ingredients
- Save recipes to a personal collection
- View saved recipes in a collection

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **HTTP Client**: Axios

## Setup Instructions

### 1. Backend (Server) Setup

1. Clone the repository and navigate to the `server` folder.
    ```bash
    git clone <repo-url>
    cd server
    ```

2. Install the required dependencies.
    ```bash
    npm install
    ```

3. Ensure that MongoDB is running locally or update the MongoDB connection string in `server/index.js` if using a remote database.

4. Start the server.
    ```bash
    node index.js
    ```

   The server will start running on `http://localhost:3001`.

### 2. Frontend (Client) Setup

1. Open a new terminal window and navigate to the `client` folder.
    ```bash
    cd client
    ```

2. Install the required dependencies.
    ```bash
    npm install
    ```

3. Start the client.
    ```bash
    npm start
    ```

   The client will start running on `http://localhost:3000`.

### 3. MongoDB Setup

- Ensure you have MongoDB installed and running on your local machine. The default connection string assumes that MongoDB is running locally on the default port (`mongodb://localhost:27017/recipe`).
- If you are using a remote MongoDB instance, update the connection string in `server/index.js`.

### 4. API Endpoints

- `POST /saveRecipe`: Save a recipe to the collection.
- `GET /savedRecipes`: Retrieve saved recipes from the collection.

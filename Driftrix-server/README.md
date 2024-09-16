# Draftrix Backend

This is the backend server for the **Draftrix - Draw Here!** application. It provides RESTful API endpoints to handle the storage, retrieval, updating, and deletion of drawings. The backend is built with Node.js and Express and uses MongoDB for data storage.

## Features

- **RESTful API**: Provides endpoints to manage drawings (create, read, update, delete).
- **MongoDB**: Database for storing drawings, including metadata like drawing names and authors.
- **CORS Enabled**: Allows cross-origin requests from the frontend.
- **Environment Configuration**: Secure environment variables for database credentials and configurations.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database to store drawing data.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **dotenv**: For managing environment variables.

## How to Run

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/draftrix-backend.git
    ```
2. Navigate to the backend directory:
    ```bash
    cd draftrix-backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root directory and add your environment variables:
    ```
    PORT=4000
    DB_USER=your_db_username
    DB_PASS=your_db_password
    MONGO_URI=your_mongodb_uri
    ```
5. Start the server:
    ```bash
    node index.js 
    ```
    or, 
    ```bash
    nodemon index.js 
    ```

## API Endpoints

- **GET** `/drawings`: Fetch all drawings.
- **GET** `/drawings/:id`: Fetch a drawing by ID.
- **POST** `/drawings`: Create a new drawing.
- **PATCH** `/drawings/:id`: Update an existing drawing.
- **DELETE** `/drawings/:id`: Delete a drawing by ID.



## Live API

Backend API is hosted [here](#) <!-- Replace with your actual backend URL -->

## License

This project is open-source and available under the [MIT License](LICENSE).

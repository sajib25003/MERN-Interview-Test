# Draftrix Backend

This is the backend server for the **Draftrix - Draw Here!** application. It provides RESTful API endpoints to handle the storage, retrieval, updating, and deletion of drawings. The backend is built with Node.js and Express and uses MongoDB for data storage.

## Live API

**Main:** https://driftrix-server.vercel.app/
**All Drawings:** https://driftrix-server.vercel.app/drawings
**Main:** https://driftrix-server.vercel.app/drawings/:id

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

## API Endpoints

- **GET** `/drawings`: Fetch all drawings.
- **GET** `/drawings/:id`: Fetch a drawing by ID.
- **POST** `/drawings`: Create a new drawing.
- **PATCH** `/drawings/:id`: Update an existing drawing.
- **DELETE** `/drawings/:id`: Delete a drawing by ID.

## Live API

https://driftrix-server.vercel.app/

## License

This project is open-source and available under the [MIT License](LICENSE).

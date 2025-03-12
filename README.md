# URL Shortener API with Express and MongoDB

This is a URL shortener API built using **Express.js** and **MongoDB**. It allows users to shorten long URLs and provides functionality to redirect to the original URL using the shortened version. Additionally, it includes a history endpoint to fetch all shortened URLs.

---

## Features

- **Shorten URLs**: Convert long URLs into shorter, randomized slugs.
- **Redirect**: Redirect users to the original URL using the shortened slug.
- **History**: Fetch all shortened URLs for reference.
- **Validation**: Validate URLs before shortening.
- **Error Handling**: Proper error handling for invalid requests and server errors.
- **CORS Support**: Cross-Origin Resource Sharing (CORS) is enabled for all origins (update in production).

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Git](https://git-scm.com/) (optional)

---

## Installation

1. **Clone the repository** (if applicable):

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add the following variables:

   ```env
   MONGO_URI=mongodb://localhost:27017/your-database-name
   PORT=4000
   ```

   Replace `your-database-name` with your MongoDB database name and `4000` with your desired port.

4. **Start the server**:

   ```bash
   npm run dev
   ```

   The server will start running on the specified port 4000.

---

## API Endpoints

### Health Check

- **GET `/`**: Check if the server is running.

  **Response**:

  ```json
  {
    "Greeting": "Welcome to server"
  }
  ```

---

### URL Shortening

- **POST `/url/shorten`**: Shorten a long URL.

  **Request**:

  ```json
  {
    "originalUrl": "https://example.com/very-long-url"
  }
  ```

  **Response**:

  ```json
  {
    "success": true,
    "data": {
      "originalUrl": "https://example.com/very-long-url",
      "shortenedUrl": "http://localhost:3000/url/abc123"
    },
    "message": "Shortened URL created successfully"
  }
  ```

---

### Redirect to Original URL

- **GET `/url/:slug`**: Redirect to the original URL using the shortened slug.

  **Example**:

  - Request: `GET /url/abc123`
  - Response: Redirects to `https://example.com/very-long-url`.

---

### Fetch All Shortened URLs

- **GET `/url/red/history`**: Fetch all shortened URLs.

  **Response**:

  ```json
  {
    "success": true,
    "data": {
      "urls": [
        {
          "originalUrl": "https://example.com/very-long-url",
          "shortenedUrl": "http://localhost:3000/url/redirect?slug=abc123"
        }
      ]
    },
    "message": "Successfully fetched all shortened URLs"
  }
  ```

---

## Directory Structure

```
your-repo-name/
├── models/                   # MongoDB models
│   └── Url.js                # URL model schema
├── routes/                   # API routes
│   └── url_route.js          # URL-related routes
├── helpers/                  # Helper functions
│   └── sendResponse.js       # Utility for sending API responses
├── .env                      # Environment variables
├── package.json              # Node.js dependencies and scripts
├── README.md                 # This file
└── index.js                  # Main server file
```

---

## Configuration

- **MongoDB Connection**: Update the `MONGO_URI` in the `.env` file to point to your MongoDB instance.
- **CORS**: By default, CORS is enabled for all origins. Update the `cors` configuration in `index.js` for production.
- **Port**: Change the `PORT` in the `.env` file to use a different port.

---

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy coding! 🚀

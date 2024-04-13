# User Management RESTful API
This project implements a RESTful API using Node.js, Express, and MongoDB for managing user information. The API includes endpoints for creating, updating, deleting, and retrieving users, as well as uploading images. The user data is securely stored in a MongoDB database, and password hashing is implemented using bcrypt for added security.

## Endpoints
### 1. Create User
  - Endpoint: POST '/user/create'
  - Function: Creates a new user with full name, email, and password. Validates email format, full name, and enforces strong password rules.
  - Response:
    - Status Code: 201 (User created successfully)
    - Status Code: 400 (Validation error)
    - Status Code: 409 (User already exists)

### 2. Update User Details
  - Endpoint: PUT '/user/edit'
  - Function: Allows updating the user's full name and password. Email cannot be updated. Validates full name and password, and ensures the user exists in the database before updating.
  - Response:
    - Status Code: 200 (User updated successfully)
    - Status Code: 404 (User not found)

### 3. Delete User
  - Endpoint: DELETE '/user/delete'
  - Function: Deletes a user by their email.
  - Response:
    - Status Code: 200 (User deleted successfully)
    - Status Code: 404 (User not found)
   
### 4. Retrieve All Users
  - Endpoint: GET '/user/getAll'
  - Function: Retrieves all users' full names, email addresses, and passwords stored in the database.
  - Response:
    - Status Code: 200 (A list of users)
    - Status Code: 500 (Internal server error)
   
### 5. Upload Image
  - Endpoint: POST '/user/uploadImage'
  - Function: Allows users to upload an image file to the server. Accepts only JPEG, PNG, and GIF formats. Uses Multer for file handling. Stores the uploaded image in an "images" folder and saves the path in the database.
  - Response:
    - Status Code: 200 (Image uploaded successfully)
    - Status Code: 400 (Bad request, such as missing file or user ID)
    - Status Code: 500 (Internal server error)

## Getting Started
To run the API locally:

1. Clone the repository to your local machine.
2. Install dependencies using npm install.
3. Start the server with npm start.
4. Use Postman or any other API testing tool to send requests to the specified endpoints.

### Technologies Used:
- Node.js
- Express.js
- MongoDB
- bcrypt
- Multer

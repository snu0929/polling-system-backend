### **Polling System Backend**

This is the backend for the Polling System project, built with **Node.js** and **Express.js**. It manages user authentication, poll creation, voting, comments, and real-time updates using **Socket.IO**.

### **Features:**
- User authentication (register, login, profile management)
- Poll creation and voting
- Real-time voting and commenting
- Middleware for authentication and error handling

---

### **Table of Contents:**
1. [Installation](#installation)
2. [Environment Variables](#environment-variables)
3. [API Routes](#api-routes)
    - [User Routes](#user-routes)
    - [Poll Routes](#poll-routes)
    - [Comment Routes](#comment-routes)
4. [WebSocket Events](#websocket-events)
5. [Middleware](#middleware)

---

### **1. Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/polling-system-backend.git
   ```

 2 **Navigate to the project directory:**
   ```bash
  cd polling-system-backend
```
3 **Install dependencies:**
```bash
yarn install
```
4 **Start the server:**
```bash
yarn start or yarn run dev
```

### **2. Environment Variables**
You will need to create a .env file in the root directory to configure environment variables. The following variables are required:
```bash
PORT=8000
MONGO_URI=your_mongo_database_uri
JWT_SECRET=your_jwt_secret_key
```
Make sure your .env file is not pushed to version control by adding it to .gitignore.


### Part 2: API Routes

```markdown
## 3. API Routes

### User Routes

- **POST `/register`**  
  _Register a new user._
  
- **POST `/login`**  
  _Login user and get JWT token._

- **GET `/profile`**  
  _Fetch the profile of the logged-in user._

- **POST `/uploadProfilePicture`**  
  _Upload or update the user's profile picture._

---

### Poll Routes

- **POST `/create`**  
  _Create a new poll (authenticated)._

- **GET `/all`**  
  _Get all available polls._

- **GET `/polls/:pollId`**  
  _Get details of a specific poll (authenticated)._

- **POST `/polls/vote/:pollId`**  
  _Vote on a specific poll._

---

### Comment Routes

- **POST `/polls/:pollId/comments`**  
  _Add a comment to a specific poll (authenticated)._

- **GET `/polls/:pollId/comments`**  
  _Get all comments on a specific poll._

---
```
### License
This project is licensed under the MIT License. See the LICENSE file for details.

****


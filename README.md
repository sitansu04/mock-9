# Social Media App

## Dependencies

> "bcrypt": "^5.1.0",

> "cors": "^2.8.5",

> "dotenv": "^16.0.3",

> "express": "^4.18.2",

> "jsonwebtoken": "^9.0.0",

> "mongoose": "^7.1.0",

> "nodemon": "^2.0.22"

## Start

- To atart the application backend server first run in command
  `npm i`
- second run in command `npm run server`

- this will run the server at `https://localhost:8000`

## All Endpoints

| METHOD      | ENDPOINT                         | DESCRIPTION                                                                                                             | STATUS CODE |
| ----------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------- |
| POST        | /api/register                    | This endpoint should allow users to register. Hash the password on store.                                               | 201         |
| GET         | /api/users                       | This endpoint should return a list of all registered users.                                                             | 200         |
| GET         | /api/users/:id/friends           | This endpoint should return a list of all friends of a specific user identified by its ID.                              | 200         |
| POST        | /api/users/:id/friends           | This endpoint should allow the user to send a friend request to another user identified by its ID.                      | 201         |
| PUT / PATCH | /api/users/:id/friends/:friendId | This endpoint should allow users to accept or reject friend requests sent to them by another user identified by its ID. | 204         |
| GET         | /api/posts                       | This endpoint should return a list of all posts.                                                                        | 200         |
| POST        | /api/posts                       | This endpoint should allow the user to create a new post.                                                               | 201         |
| PUT / PATCH | /api/posts/:id                   | This endpoint should allow users to update the text or image of a specific post identified by its ID.                   | 204         |
| DELETE      | /api/posts/:id                   | This endpoint should allow users to delete a specific post identified by its ID.                                        | 202         |
| POST        | /api/posts/:id/like              | This endpoint should allow users to like a specific post identified by its ID.                                          | 201         |
| POST        | /api/posts/:id/comment           | This endpoint should allow users to comment on a specific post identified by its ID.                                    | 201         |
| GET         | /api/posts/:id                   | This endpoint should return the details of a specific post identified by its ID.                                        | 200         |

## Register user Schema

- Body

```javascript
{
   "name": "A Mandal",
   "email": "a@gamil.com",
   "password": "a@123",
   "dob": "2000-05-02T06:53:39.955Z",
   "bio": "Full stack_web Developer"
 }
```

- Schema

```javaScript
{
    name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  bio: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}
```

## Register Post Schema

- Body

```javascript
    {
    "text":"Node",
    "image":"www.node.js"
    }
```

- Schema

```javascript
{
     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  image: String,
  createdAt: Date,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: Date,
    },
  ],
}
```

## User like the post
- Body
```javascript
{
    "user":"6450b59459de4fdb95caffa4"
}
```
## User comment the post
- Body
```javascript
   {
    "user":"6450b59459de4fdb95caffa4",
    "text":"Awesome",
    "createdAt":"2023-05-02T06:53:39.955+00:00"
   }
```
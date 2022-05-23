# full_stack_open_2021_part4

https://fullstackopen.com/en/part4
 
Backend for retrieving, creating, updating and deleting blogs. Has user authentication (controllers/login.js).
Only the user can create and delete its blogs.

## Controllers
Save the files that contain the routers for the api.

## Models
Contain the model itself (blog and user). The interesting part here is that we are using document databases,
so we cannot use foreign keys. We have to create something like this:

```javascript
{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Table',
},
```

## Rest
We are using the simple Rest client to perform some basic operations.

## Tests
The important test is the one in blogs_supertest.test.js and its helper 'test_helper.js'.

## Utils
Contains the different parts of the middleware (ex. how the token and the user are extracted from the authorization header).

## Eslint
Using Airbnb style with some modifications.

### How to run?

#### Environment Variables

Create a file .env in the root of the backend. It should contain:

```
TEST_MONGODB_URI=mongodb+srv://dajimenezriv:<password>@cluster0.zdudq.mongodb.net/blogs?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://dajimenezriv:<password>@cluster0.zdudq.mongodb.net/testBlogs?retryWrites=true&w=majority
PORT=3003
SECRET=secret
```

#### Tests

```console
# jest
npm test
# test mode (for cypress)
npm run start:test
```

We can test manually with the requests in the `rest` folder.

#### Locally

```console
# development mode
npm run dev
# production mode
npm start
```

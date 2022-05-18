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
The others are more dummy.

## Utils
Contains the different parts of the middleware (ex. how the token and the user are extracted from the authorization header).

## Eslint
Using Airbnb style.

### How to run?

#### Tests

```console
npm test
```

#### Locally

There is no url for frontend. But we can test manually with the requests in the `rest` folder.

```console
# development mode
npm run dev
# production mode
npm start
# test mode (for cypress)
npm run start:test
```

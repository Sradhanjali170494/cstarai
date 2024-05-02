const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const gql = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const cors = require('cors');
const path = require('path');

// Assuming your uploads folder is in the same directory as your Node.js script
const uploadsDir = path.join(__dirname, 'uploads');

const typeDefs=require('./typedefs')
const resolvers=require('./resolvers')

const port = process.env.PORT || 8000;
const app = express();
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Increase the limit for JSON payloads
app.use(express.json({ limit: '100mb' }));

// Increase the limit for URL-encoded payloads
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Serve static files from the uploads folder
app.use('/uploads', express.static(uploadsDir));


app.use(
  '/graphql',
  cors(),
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(port);
console.log(`Server listening at localhost:${port}`);
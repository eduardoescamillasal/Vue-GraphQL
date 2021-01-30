
/*
* SCHEMA
*/
const { ApolloServer, gql } = require('apollo-server');
const schema = gql(`
  type Query {
    currentUser: User
    postsByUser(userId: String!): [Post]
  }

  type User {
    id: ID!
    username: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    content: String!
    userId: ID!
  }
`);

/*
* DATA SOURCE
*/
var data = {};

data.posts = [
  {
    id: 'xyz-1',
    content: "First Post - Hello world",
    userId: 'abc-1',
  },
  {
    id: 'xyz-2',
    content: "Second Post - Hello again",
    userId: 'abc-1',
  },
  {
    id: 'xyz-3',
    content: "Random Post",
    userId: 'abc-2',
  }
];

data.users = [
  {
    id: 'abc-1',
    username: "andy25",
  },
  {
    id: 'abc-2',
    username: "randomUser",
  }
];

const currentUserId = 'abc-1'
/*
* RESOLVERS
* function(parent, args, context, info) {
*   //return something
* }
*/
/* JAVASCRIPT
var resolvers = {
  Query: {
    currentUser: (_, __, context) => {
      let user = context.data.users.find(u => u.id === context.currentUserId);
      // set posts as a property in user (immutable)
      return user;
    },
    postsByUser: (_, args, context) => {
      let posts = context.data.posts.filter(p => p.userId === args.userId);
      return posts;
    },
  },

  User: {
    posts: (parent, __, context) => {
      let posts = context.data.posts.filter(p => p.userId === parent.id);
      return posts;
    }
  }
};
*/

//ES6 Way
var resolvers = {
  Query: {
    currentUser: (_, __, { data, currentUserId }) => {
      let user = data.users.find( u => u.id === currentUserId );
      return user;
    },
    postsByUser: (_, { userId }, { data }) => {
      let posts = data.posts.filter( p => p.userId === userId );
      return posts
    },
  },
  User: {
    posts: (parent, __, { data }) => {
      let posts = data.posts.filter( p => p.userId === parent.id );
      return posts;
    }
  }
};



/*
*  SERVER
*/

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  context: {
    currentUserId,
    data
  }
});

server.listen(4001).then(({url}) => {
  console.log('API server running at localhost:4001');
});

/*
 // run from console in any browser
 fetch('http://localhost:4001', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'query { currentUser { id } }' }),

// "unpacks" the Promise Object
.then(resp => resp.json())
.then(data => console.log(data))
})
*/

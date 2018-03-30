# Building a hacker news clone with NodeJS and GraqphQL

<hr/>

In this repository, you can find the results of the excellent tutorial on [howtographql.com](https://www.howtographql.com/graphql-js/) and the notes I made on the use of GraphQL.

Clone the repository and install the dependencies:
```
yarn install
```
Deploy the Prisma database service:
```
yarn prisma deploy
```
Run the (dev) environment (which allows you to open up the playground):

```
yarn dev
```
or
```
yarn start
```

The server is running on `localhost:4000` (and the playground on `localhost:3000/playground` if you run `yarn dev`  )
<hr/>

> ## Features:
> This is only a back end, but if it would have a frontend, 
> - **A user could signup:**<br/>
>_try it out by running the following query in the playground:_
> ```
>mutation {
>  signup(email: "yourname@graph.cool" password: "graphql" name: "Grace") {
>    token
>    user {
>      id
>    }
>  }
>}
>```
> 
> - **A user could log in:**<br/>
>_try it out by running the following query in the playground:_
> ```
>mutation {
>  login(email: "johndoe@graph.cool" password: "graphql") {
>    token
>  }
>}
>```
> - **Subscribed clients would be sent realtime updates when a new link element is created or when an existing link is upvoted**
> - **A user could post or upvote an article** - but only after signing up or logging in!<br/>
>   - After siging up/logging in, copy the `token`  from the JSON response of the server and use it to replace the `__TOKEN__` placeholder in the following HTTP header. This header needs to be put into the HTTP HEADERS pane in the bottoms-left corner of the playground:
>```
>{
>  "Authorization": "Bearer __TOKEN__"
>}
>```
>   - To Post:
>   ```
>   mutation{
>     post(
>       url: "https:/grapqhlweekly.com"
>       description: "Weekly GraphQL Newsletter"
>     ) {
>       id
>     }
>   }
>   ```
>   - To verify that it was actually posted by the User who the token belongs to:
>   ```
>   {
>     description
>     postedBy {
>       email
>     }
>   }
>   ```
>   - And to prove it actually exists:
>   ```
>   {
>     feed {
>       description
>       url
>     }
>   }
>   ```
>   - To vote:
>   ```
>   mutation{
>     vote(
>       linkId: "cjfb2bmgla2rg0b97mtz9htmb" 
>     ) {
>       id
>     }
>   }
>   ```
>- **Subscribed clients would be sent realtime updates when a new link element is created or when an existing link is upvoted**:
>```
>subscription {
>  newLink {
>    node {
>      description
>      url
>      postedBy {
>        email
>      }
>    }
>  }
>}
>```
> _To check, in a new tab of the playground, post a new link!_
>
> Enjoy!

<br/><br/>

# Notes on GraphQL

## What does GraphQL it do?
With GraphQL you can exactly the data you asked for, in the form you asked for. You can **describe data**, specify the what **data you need** to make sure you get **predictable results**. In this way, it solves the problem of overfetching (with REST calls you'll always get ALL data, even if you only want one part.), which is especially interesting since increased mobile usage creates need for efficient data loading.

Furthermore, it works well with all **different frontend frameworks/platforms** and **works more efficiently than the traditional REST-calls**. With a REST API, you would typically gather data by accessing multiple endpoints. In GraphQL, you only have send a single query to the GraphQL server that includes the concrete data requirements. The server responds with json object where these requirements are fulfilled.

Once a schema is defined, frontend and backend teams can work independently from each other.

## How does it work?

GraphQL is placed between your Client(s) and your database or API(s). The client talks to GraphQL, Graphql talks to the backend/db.

> In this project, we are using graphql as a backend so it is talking directly to the database.

## Which steps to take...
When building a server, you are basically constantly defining your query and mutation types (and possibly more specific types such as **user** and **link** in this repository - which is called **_adding root fields_**) in `src/schema.graphql`, build a resolver for it in the corresponding `resolver file`.

> Extra steps in this project are to add the data types to the `database/datamodel.graphql` and deploy the prisma database to make sure we can communicate with the Prisma database.

## Schemas and Types

### Types
 The GraphQL query language is basically about selecting fields on objects. You start with a root object, select a field on that, explain what the field should return.
The most basic components of a GraphQL schema are **object types**, which just represent a kind of object you can fetch from your service, and what fields it has. A **Schema** consists of:
- Type definitions to describe our data and what we can do with it
- Resolvers to tell GraphQL where to get the data from and how to handle mutations
>Int this project you can find all type defitions not only in the schema, but also in `database/datamodel.graphql`!

### Arguments
**Arguments** can be required or optional. When an argument is optional, you can define a default value.

### Query & mutation types
Every GraphQL service has a **query type** and possibly a **mutation type**, that can be found in the schema.

>In this project, we define the following types in our schema: `Query`, `Mutation`, `Subscription`, `AuthPayload`, `User`. 
>
>`Link`, `Vote`, `LinkSubscriptionPayload`, `VoteSubscriptionPayload` are defined in `database/datamodel.graphql`.

### Scalar Types
**Scalar types** represent the  leaves of the query. GraphQL comes with a set of default scalar types out of the box: `Int`, `Float`, `String`, `Boolean`, `ID`. 

### Enumeration Types
**Enums** are a special kind of scalar that is restricted to a particular set of allowed values. This allows you to:
* **Validate** that any arguments of this type are on one of the allowed values
* **Communicate** through the type system that a field will always be on of a finite set of values.

### Interfaces

An **interface** is an abstract type that includes a certain set of fields that a type must include to implement the interface.
You set up your interface with the fields, arguments and return types which every type that implements the interface should have.

### Root fields & Resolvers
At the top level of every GraphQL server is a type that represents all of the possible entry points into the GraphQL API, it’s often called the Roottype or the Querytype.
Each field on each type of a GraphQL query is backed by a function called the **resolver**, which is provided by the GraphQL server developer. This is where the actual 'queries'  are performed.

>In this project, we have Mutation, Query and Subscription resolvers, executed for fields like `feed`, `token` & `user`

## Authentication
When accessing a the Prisma db service over HTTP, you need to authenticate by attaching an authentication token to the `Authorization` header field.The `Prisma` instance in `index.js` recieves the `secret` as a constructor argument, so it can generate JWTs under the hood.

> For simplicity, our application secret is defined as a global constant

## GraphQL subscriptions

**Subscriptions** are a GraphQL feature that allows the server to send data to the clients when a specific event happens. The client initially opens up a steady conneciton to the server by specifying which event it is interested in, usually through [Websockets](https://developer.mozilla.org/nl/docs/WebSockets).

> In this project, we make use of Prisma, with comes with out-of-the-box support for subscriptions. Have a look at `src/generated/prisma.graphql`! - but they are also defined through GraphQL in the code. 

> _This Repository is created by Mimi Magusin. Her personal profile can be found [here](https://github.com/MimiMagusin), her Codaisseur Profile can be found [here](https://github.com/MimiMag)_

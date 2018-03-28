# Building a hacker news clone with NodeJS and GraqphQL

<hr/>

In this repository, you can find the results of the excellent tutorial on [howtographql.com](https://www.howtographql.com/graphql-js/) and the notes I made on the use of GraphQL.

Clone the repository and install the dependencies:
```
yarn install
```
Run the dev environment (which allows you to open up the playground):

```
yarn dev
```
<hr/>

> ## Features:
> This is only a back end, but if it would have a frontend, 
> - A user could login
> - It would be kept updated on the last links
> - A user could post or upvote an article
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

## Which steps to take...
When building a server, you are basically constantly defining your query and mutation types (and possibly more specific types such as **user** and **link** in this repository) in `src/schema.graphql`, build build a resolver for it in the corresponding `resolver file`.

## Schemas and Types

### Types
 GraphQL query language is basically about selecting fields on objects. You start with a root object, select a field on that, explain what the field should return.
The most basic components of a GraphQL schema are **object types**, which just represent a kind of object you can fetch from your service, and what fields it has.

### Arguments
**Arguments** can be required or optional. When an argument is optional, you can define a default value.

### query & mutation types
Every GraphQL service has a query type and possibly a **mutation type**. 

### Scalar Types
**Scalar types** represent the  leaves of the query.

### Enumeration Types
**Enums** are a special kind of scalar that is restricted to a particular set of allowed values. This allows you to:
* **Validate** that any arguments of this type are on one of the allowed values
* **Communicate** through the type system that a field will always be on of a finite set of values.

### Interfaces

An **interface** is an abstract type that includes a certain set of fields that a type must include to implement the interface.
You set up your interface with the fields, arguments and return types which every type that implements the interface should have.

### Root fields & Resolvers
At the top level of every GraphQL server is a type that represents all of the possible entry points into the GraphQL API, it’s often called the Roottype or the Querytype.
Each field on each type of a GraphQL query is backed by a function called the **resolver**, which is provided by the GraphQL server developer. When a fixed is executed, the corresponding resolver is called to produce the next value until it produces a scalar value.

## Authentication
When accessing a the Prisma db service over HTTP, you need to authenticate by attaching an authentication token to the `Authorization` header field.The `Prisma` instance in `index.js` recieves the `secret` as a constructor argument, so it can generate JWTs under the hood.

> For simplicity, our application secret is defined as a global constant


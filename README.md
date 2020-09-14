# Swagger generated server for a Simple Story Service

## Setup
```
        git clone https://github.com/siddharths067/oapi-blogger.git
        cd oapi-blogger
        docker-compose build && docker-compose up -d
        cd ..
        git clone https://github.com/siddharths067/oapi-blogger-fe.git
        cd oapi-blogger-fe
        npm start
        echo "open localhost:3000 in browser" 
```

Since this assignment wasn't complex and everything was achievable using simple RDBMS, I didn't post an architecture diagram.

Simple storyboard
- User signups
- User logs in
- User goes to feed page where he can post a story
- When user clicks on a story he enters a story page, here a string is added in the `story_stats` table, this string is deterministically mapped to user and post. This is updated in a non-blocking fashion.
- To generate statistics we just use a simple regex query on the SQL table `story_stats` plus a timestamp clause to filter out users who read story before 1 minute. This gives the number of distinct users in 1 minute interval. 
- As far as efficiency is concerned for P posts and U users we won't ever have more than P*Q entries (AT MAX) no matter how many times user visits.

## Documentation of API
To view backend endpoint documentation goto 
`localhost:8080/docs`

## Overview
This server was generated by the [swagger-codegen](https://github.com/swagger-api/swagger-codegen) project.  By using the [OpenAPI-Spec](https://github.com/OAI/OpenAPI-Specification) from a remote server, you can easily generate a server stub.

### Running the server
To run the server, run:

```
npm start
```

To view the Swagger UI interface:

```
open http://localhost:8080/docs
```

This project leverages the mega-awesome [swagger-tools](https://github.com/apigee-127/swagger-tools) middleware which does most all the work.

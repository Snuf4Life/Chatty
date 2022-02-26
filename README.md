# Chatty - the ultimate companion

###### Please note

This is my first Socket.io / Lit / Elasticsearch project ever!
I never used those technologies before.

It was challenging (in the good way) and fun, I put a lot of effort into the project (given the time I had).

Yet I guess I'm not using all the best practices with current tech-stack.

###### Development

Prerequisites

- NodeJs (14.x and above)
- Docker

This is a mono-repo so, you need to install & run each project alone.

First git clone the repository `bash git clone https://github.com/Snuf4Life/Chatty.git`

Server

Note - There is an .env.example file in server folder that should become .env file.

```bash
cd ./Chatty/server
npm i && docker-compose up
```

Wait the docker to finished building, then

```bash
npm start
```

Client

```bash
cd ./Chatty/client
npm i && docker-compose up
```

# Chatty - the ultimate companion

## Please note

Please consider Chatty is my first Socket.io / Lit / Elasticsearch project ever! I had never used those technologies before.

I guess I'm not using all the best practices with the current tech stack.

Yet it was challenging (in a good way) and fun. I put a lot of effort into the project (given the time I had).


## Development

Prerequisites

- NodeJs (14.x and above)
- Docker

This is a mono-repo so, you need to install & run each project separately.

First git clone the repository 
```bash
git clone https://github.com/Snuf4Life/Chatty.git
```

### Server

Note - There is an .env.example file in server folder that should become .env file, fill the missng data as you like.

```bash
cd ./Chatty/server
npm i && docker-compose up
```

Wait the docker to finished building, then

```bash
npm start
```
If you get connection error (ConnectionError: other side closed - Local...)
Try to change the http://localhost:<the port of elastic> to HTTPS, should solve the problem. 

### Client

```bash
cd ./Chatty/client
npm i && npm start
```

### About Chatty
Its a simple chat application, just enter your nickname (do not use the word "chatty" in your name he doesn't like it) and go in.
You can ask Chatty simple general question like:
- Hi Chatty
- Do you love me?
- Whats your dream

Also Chatty has a tag system where you can mark your text input as a question, then other users can answer it.
When answering a question, chatty remembers the answer.
Next time Chatty will be able to answer the same question by himself. 

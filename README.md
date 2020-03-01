# SWENG-Group-9

[![Build Status](https://travis-ci.com/CSU33013-SWENG-Group-9/Easy-Annotator.svg?branch=master)](https://travis-ci.com/CSU33013-SWENG-Group-9/Easy-Annotator)

### Getting Started

1. Install [Node.js](https://nodejs.org)
2. Clone this repository
3. Open up command prompt or teminal and navigate to the location of the cloned repository
4. Install the dependencies

   ```Shell Session
   npm install
   ```

5. Running the server

   ```Shell Session
   npm run dev
   ```

   The server should now be hosted on [http://localhost:3000](http://localhost:3000)

### Docs

- [Node.js](https://nodejs.org/en/docs/)
- [React](https://reactjs.org/docs/getting-started.html)
- [NextJs](https://nextjs.org/docs/getting-started)
- [react-player](https://github.com/CookPete/react-player)
- [styled components](https://styled-components.com/docs)

### Building and Publishing with Docker

#### Building an image

   docker build -t <image>:<tag> .

#### Running the image

   docker run -p 3000:3000 <image>:<tag>

#### Tagging and Publishing

   docker build -t <username>/<repository>:<tag> .
   docker tag <username>/<repository>:<tag> <username>/<repository>:latest
   docker push <username>/<repository>:<tag>


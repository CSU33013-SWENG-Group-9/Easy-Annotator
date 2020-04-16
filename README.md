# [EasyAnnontator](https://easyannotator.azurewebsites.net/)

#### Hosted on [easyannotator.azurewebsites.net](https://easyannotator.azurewebsites.net/)

##### Recommended browser: [Firefox](https://www.mozilla.org/en-US/firefox/new/) (_Works on all browsers but some UI elements may load incorrectly_)

[![Build Status](https://travis-ci.com/CSU33013-SWENG-Group-9/Easy-Annotator.svg?branch=master)](https://travis-ci.com/CSU33013-SWENG-Group-9/Easy-Annotator)

A React based project built for IBM research and Dr. Ronan Cahill from UCD. It allows a surgeon or surgeon's assistant to upload a video from surgery from a near infrared camera, select regions of interests (ROIs) that the user believes to possibly be cancerous, write comments on the ROIs and video, and finally export all this data in a JSON format which can be used by the algorithm developed by IBM.


![EasyAnnotator Screenshot](https://i.imgur.com/9RpOSBy.jpg)

This project was developed for Trinity's Computer Science module, Software Engineering Project (_CSU22013_, _CSU33013_).

Built by _[Chole Connely](https://github.com/TheCsWorld), [Cian Galligan](https://github.com/xaarrssx), [Daniel Grace](https://github.com/danana5), [Jack Gilbride](https://github.com/jackgilbride999), [Yannick Gloster](https://github.com/yannickgloster), [David Green](https://github.com/dgreen8443), and [Luke Hackett](https://github.com/LukeHackett12)_.

### Getting Started

1. Install [Node.js](https://nodejs.org)
2. Clone this repository
3. Open up command prompt or teminal and navigate to the location of the cloned repository
4. Install the dependencies

   ```Shell Session
   npm install
   ```

5. Running the server locally

   ```Shell Session
   npm run dev
   ```

   The server should now be hosted on [http://localhost:3000](http://localhost:3000)

### Some Relevant Docs

- [Node.js](https://nodejs.org/en/docs/)
- [React](https://reactjs.org/docs/getting-started.html)
- [NextJs](https://nextjs.org/docs/getting-started)
- [react-player](https://github.com/CookPete/react-player)
- [rebass](https://rebassjs.org/)
- [theme-ui](https://theme-ui.com/)
- [React-resizable-rotatable-draggable-rectangle](https://github.com/CSU33013-SWENG-Group-9/react-resizable-rotatable-draggable)
  - Modified React-resizable-rotatable-draggable-rectangle to allow control the coloring of the rectangle


### Building and Publishing with Docker

#### Building an image

```Shell Session
docker build -t <image>:<tag> .
```

#### Running the image

```Shell Session
docker run -p 3000:3000 <image>:<tag>
```

#### Tagging and Publishing

```Shell Session
docker build -t <username>/<repository>:<tag> .
docker tag <username>/<repository>:<tag> <username>/<repository>:latest
docker push <username>/<repository>:<tag>
```
=======
   ```Shell Session
   docker build -t <image>:<tag> .
   ```

#### Running the image
   
   ```Shell Session
   docker run -p 3000:3000 <image>:<tag>
   ```

#### Tagging and Publishing
   
   ```Shell Session
   docker build -t <username>/<repository>:<tag> .
   docker tag <username>/<repository>:<tag> <username>/<repository>:latest
   docker push <username>/<repository>:<tag>
   ```

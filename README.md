# [Cimice](http://artf.github.io/cimice)

[![Build Status](https://travis-ci.org/artf/cimice.svg?branch=master)](https://travis-ci.org/artf/cimice)

Cimice is an experimental user session recorder. The goal is to recreate, at least in part, the core function of already popular cloud services available online ([see below](#cool-cloud-services)).

<p align="center"><img src="http://artf.github.io/cimice/public/images/cimice-demo.gif" alt="Cimice" width="100%" align="center"/></p>


## Features

* Built-in support for `click`, `mousemove`, `scroll` and `resize` events
* No dependencies
* Easily extendible


## Installation

All you need is `cimice.min.js` file inside `/dist` folder that you can get from the cloned repo via `git clone https://github.com/artf/grapesjs.git` / `npm install cimice` or download it directly from [here](https://raw.githubusercontent.com/artf/cimice/master/dist/cimice.min.js)


## Development

Clone the repository and enter inside the folder

```sh
$ npm install cimice
$ cd cimice
```

Install all necessary dependencies

```sh
$ npm install
```

Start dev server

```sh
$ npm run dev
```


## Usage

Below you can see some of the real live examples on how to use Cimice for better fit your needs.


### Recording

**Example 1** *(quick but not recommended)*

Record the entire site and send data to some endpoint every 5 seconds

```js
let rec = new cimice.Recorder({
  target: document.documentElement
});

rec.startRecording();

setInterval(() => {
  let json = JSON.stringify(rec.getMovie());
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://your/endpoint');
  xhr.send(json);
}, 5000);
```

**Example 2**

The first example is simple but there is a big overhead as you send always all recorded `frames` and keep them in memory.
Furthermore, you could potentially send data even without user interaction and that is pretty annoying.
In the example I use `XMLHttpRequest`, to send data over the net, only for the simplicity but you can replace it with your favorite alternative (JQuery, socket.io, etc)

```js
let rec = new cimice.Recorder({
  target: document.documentElement
});

// At first, when the recording starts I want to be sure to send initial
// data about the movie/target/screen
rec.on('startRecording', () => {
  let movieJson = JSON.stringify(rec.getMovie());
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://save/movie');
  xhr.send(movieJson);
});

// Next listener sends last new recorded frames every 50 interactions (with default mousemove
// event it's already pretty much high frequency) and remove them from the collection.
// Anyway this logic is pretty much simple but ok as example, I suggest to build your own.
rec.on('recording', () => {
  let movie = rec.getMovie();
  let frames = movie.getFrames();
  let framesJson = JSON.stringify(frames);
  if(!(frames.length % 50)){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://save/frames');
    xhr.send(framesJson);
    movie.setFrames([]);
  }
});

rec.startRecording();
```


### Playing

```js
// Here I supposed to have all recorded data inside fetched movie, but following the
// second recording example you could probably have to fetch also frames data. So
// you could have to do something like this:
// let movieJSON = fetchMovie();
// let framesJSON = fetchFrames(); // Should be an array of objects
// movieJSON.frames = framesJSON;
// let movie = new cimice.Movie(movieJSON);

let movieJSON = fetchMovie();
let movie = new cimice.Movie(movieJSON);
let player = new cimice.Player({
  target: document.getElementById('some-div')
});
player.setMovie(movie);
player.play();
```


### Extend
Cimice comes out of the box with few recordable events (click, mousemove, scroll and resize), but you can extend this behavior.
In the example below you will see how to track right mouse click (of course only the click itself, no context menu will pop up)

*Track right mouse click*

```js
// RECORDER
// At first, init your recorder to be able to listen right click events (contextmenu)
let rec = new cimice.Recorder({
  target: document.documentElement,
  events: ['mousemove', 'click', 'scroll', 'resize', 'contextmenu']
});
rec.startRecording();
// ... your logic to store data

// PLAYER
// ... fetch your movie and frames data
let movie = new cimice.Movie(movieJSON);
let player = new cimice.Player({
  target: document.getElementById('some-div')
});
player.setMovie(movie);
player.on('contextmenu', function(frame){
  let dot = document.createElement("div");
  dot.style.backgroundColor = 'blue';
  dot.style.width = '10px';
  dot.style.height = '10px';
  dot.style.borderRadius = '100%';
  dot.style.marginLeft = '-5px';
  dot.style.marginTop = '-5px';
  dot.style.position = 'absolute';
  dot.style.left = player.getCursorX() + 'px';
  dot.style.top = player.getCursorY() + 'px';
  player.getTarget().appendChild(dot);
});

player.play();
```


## API

You can find [API Reference here](http://artf.github.io/cimice/docs). The documentation is generated via [documentationjs](https://github.com/documentationjs/documentation) so if there is something to fix/add do it inside the code not API file itself


## Testing

Simple test run

```sh
$ npm test
```

Run and watch test

```sh
$ npm run test:dev
```


## Cool cloud services

If you're looking for something serious I suggest to checkout this list. If you know others feel free to pull request

* [Hotjar](https://www.hotjar.com/)
* [Inspectlet](https://www.inspectlet.com/)
* [Mouseflow](https://mouseflow.com/)
* [Clicktale](https://www.clicktale.com/)
* [Add more...](https://github.com/artf/cimice/edit/master/README.md)

## Known issues & limitations

- In Firefox, when you click 'play' button, for some reason, it will add the necessary iframe but immediately after will reload it, so you'll see nothing. One other click on 'play' should display iframe correctly
- In Safari, 'play' won't work. Seems like there is an issue with writing inside iframe (working on this)
- Dynamic contents (eg. via AJAX) are not supported.

## Why cimice?

Cimice `/ˈtʃimitʃe/`, in italian, means literally a *bug*, but in this context supposed to be a *wiretap*

## License

MIT
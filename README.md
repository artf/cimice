# Cimice

Cimice is an experimental user session recorder. The goal is to recreate, at least in part, the core function of already popular cloud services available online like Hotjar or Inspectlet.

## Features

* Built-in support for `click`, `mousemove`, `scroll` and `resize` events
* No dependencies
* Easily extendible

## Installation

All you need is `cimice.min.js` file inside `/dist` folder that you can get from the cloned repo `git clone https://github.com/artf/grapesjs.git` or download it directly from [here](https://raw.githubusercontent.com/artf/cimice/master/dist/cimice.min.js)

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

// Next listener sends last new recorded frames every 15 interactions (with default
// events it's already pretty much high frequency) and remove them from the collection
rec.on('recording', () => {
  let frames = rec.getMovie().getFrames();
  let framesJson = JSON.stringify(frames);
  if(!(frames.length % 15)){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://save/frames');
    xhr.send(framesJson);
  }
  frames = [];
});
```

## Why cimice?

'Cimice' `/ˈtʃimitʃe/`, in italian, means literally a *bug*, but in this context supposed to be a *wiretap*

## License

MIT
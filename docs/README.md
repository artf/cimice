# Recorder

**Extends Camera**

Class responsible for recording

## constructor

Create recorder

**Parameters**

-   `opts` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=(default {})** Options
    -   `opts.target` **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)=** HTMLElement on which track all events
    -   `opts.onEvents` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Define custom event callbacks for each event (optional, default `{}`)
    -   `opts.events` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>=** Events to track (optional, default `['mousemove','click','scroll','resize']`)

**Examples**

```javascript
let recorder = new cimice.Recorder({
    target: document.getElementById('to-rec'),
    events: ['mousemove', 'scroll'],
    onEvents: {
      'scroll': (recorder, movie, e) => {
        console.log('Override default scroll event callback');
       }
    }
});
```

## getEvents

Returns the array of events that will be binded to the target

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Events

## getMovie

Get recorded movie

Returns **Movie** 

## setEvents

Set an array of events that will be binded to the target. This method
overrides the previous set of events.

**Parameters**

-   `events` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>)** Event or array of events

**Examples**

```javascript
recorder.setEvents('resize');
console.log(recorder.getEvents());
// -> ['resize']
recorder.setEvents(['click','mousemove','scroll']);
console.log(recorder.getEvents());
// -> ['click','mousemove','scroll']
```

Returns **this** 

## startRecording

Bind all events to the target and start recording

## stopRecording

Unbind all events and return recorded data

Returns **Movie** Recorded movie

# Player

**Extends Camera**

Class responsible of playing recorded data

## constructor

Create player

**Parameters**

-   `opts` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=(default {})** Options
    -   `opts.target` **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)=** HTMLElement on which play data
    -   `opts.onEvents` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Define custom event callbacks for each event (optional, default `{}`)

**Examples**

```javascript
let player = new cimice.Player({
    target: document.getElementById('to-play'),
    onEvents: {
      'scroll': (player, frame) => {
        console.log('Override default scroll event callback');
       }
    }
});
```

## play

Play the movie

Returns **this** 

## setMovie

Set movie containing frames to watch

**Parameters**

-   `movie` **Movie** Movie to play

**Examples**

```javascript
let movie = new cimice.Movie();
player.setMovie(movie);
```

Returns **this** 

## stop

Stop the movie if it's playing

Returns **this** 

# Movie

Class containing recorded frames

## addFrame

Add new frame to the collection. If the object passed is an instance of Frame
it will added as it is, in case of simple object will create a new Frame
and set actual timestamp.

**Parameters**

-   `frame` **(Frame|[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))=(default {})** Frame instance or object

**Examples**

```javascript
let frame1 = movie.addFrame({eventType: 'click'});
// Or
let frame = new cimice.Frame({eventType: 'click'});
let frame2 = movie.addFrame(frame);
```

Returns **(Frame|[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined))** Added frame

## constructor

Create movie

**Parameters**

-   `opts` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=(default {})** Options
    -   `opts.frames` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;(Frame|[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))>=** Array of frames (optional, default `[]`)
    -   `opts.top` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** Top position of the movie, relative to document (optional, default `0`)
    -   `opts.left` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** Left position of the movie, relative to document (optional, default `0`)
    -   `opts.scrollX` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** The initial horizontal scroll position inside player target (optional, default `0`)
    -   `opts.scrollY` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** The initial vertical scroll position inside player target (optional, default `0`)
    -   `opts.scene` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Base64 encoded HTML string (optional, default `''`)

**Examples**

```javascript
let frame = new cimice.Frame({eventType: 'click'});
let movie = new cimice.Movie({
    top: 100,
    left: 100,
    scene: 'SGFja2VyIERldGVjdGVkIQ==',
    frames: [
      {eventType: 'click'},
      frame,
      {eventType: 'mousemove'}
    ],
});
```

## getFrames

Get the collection of frames

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;Frame>** Array of frames

## toJSON

Returns movie and related frames in JSON format. Generally coulde be used to extract data
during the recording and send back to server

**Examples**

```javascript
var json = JSON.stringify(movie);
var xhr = new XMLHttpRequest();
xhr.open('POST', url);
xhr.send(json);
```

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** JSON data

# Frame

Class representing a single frame

## constructor

Create a frame

**Parameters**

-   `opts` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=(default {})** Options
    -   `opts.cursorX` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** X cursor position, in pixels (optional, default `0`)
    -   `opts.cursorY` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** Y cursor position, in pixels (optional, default `0`)
    -   `opts.scrollX` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** X scroll length, in pixels (optional, default `0`)
    -   `opts.height` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** Height of the frame, in pixels (optional, default `0`)
    -   `opts.width` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** Width of the frame, in pixels (optional, default `0`)
    -   `opts.ts` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** Timestamp of the frame (optional, default `0`)
    -   `opts.options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Custom options (optional, default `{}`)
    -   `opts.eventType` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Event type, eg. 'click', 'mousemove' (optional, default `''`)

**Examples**

```javascript
let frame = new cimice.Frame({
    eventType: 'click',
    cursorX: 100,
    cursorY: 100,
    options: { customProp: 'customValue' }
});
```

## toJSON

Returns frame in JSON format

**Examples**

```javascript
let frame = new cimice.Frame({
    eventType: 'click',
    cursorX: 100,
    cursorY: 100,
});
console.log(JSON.stringify(frame));
```

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** String in JSON format

# Player#play

Fires on movie play

# Player#playing

Fires on playing on every frame

**Properties**

-   `frame` **Frame** Frame playing

# Player#stop

Fires on movie stop

# Recorder#recording

Fires on recording of every event

**Properties**

-   `e` **[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)** Event object

# Recorder#startRecording

Fires when start recording

# Recorder#stopRecording

Fires when stop recording

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

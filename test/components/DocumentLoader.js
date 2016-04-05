import {jsdom} from 'jsdom';

export default (()=> {
  return {
    load : (html = `<html><body>
                      <div id="target"><div></div></div>
                    </body></html>`) => {
      const document = jsdom(html);
      const window = document.defaultView;
      global.document = document;
      global.window = window;
    }
  }
})();
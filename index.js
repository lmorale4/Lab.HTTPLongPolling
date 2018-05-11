const express = require('express');
const html = require('html-template-tag');
const app = express();
const { EventEmitter } = require('events');

const clock = new EventEmitter();
setInterval(() => {
  const time = new Date().toLocaleString();
  clock.emit('tick', time);
  // console.log(clock);
}, 5000);

app.get('/', (req, res) => {
  res.send(
    html`
  <html>
    <head>
      <script type="text/javascript">
      console.log('hello world!');
      function longPollForTime () {
        fetch('/the-time')
          .then(response => response.text())
          .then(time => {
            console.log('The time is:', time)
            longPollForTime()
          })
      }
      longPollForTime()
      </script>
    </head>
  </html>
  `
  );
});

app.get('/the-time', (req, res) => {
  clock.once('tick', time => res.send(time));
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

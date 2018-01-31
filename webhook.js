const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = app.listen(process.env.PORT || 2000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  console.log('Inside get method');
  if (req.query['hub.verify_token'] === 'chatBot') {//req.query['hub.mode'] && 
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log('Inside post method');
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

function sendMessage(event) {
  console.log("Inside send events ");
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: 'EAAdg47VZC9lIBALfd4KN6xNZBfxYcYqapuiMxZBa1jmQGSx2lolcLwYpDtBGKkYZAIYBU8RuF3Pi81O7eJ4hOjOqFJ3kBVVi0ZArq1nuEYo6dZA7LhBrBz2xdUdwamO4bX9bexncTskWCUy23GMKn0ZBUQrqz5mEEOzwzbjGxFPjAZDZD'},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
  console.log("Req "+request);
}


//https://test-fb-chat-bot.herokuapp.com/webhook?hub.verify_token=chatBot
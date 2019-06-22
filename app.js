const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const port = process.env.PORT || 4000
const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer UxKnyUzzJ2Vw4rpxZBHXcuEy5ZLeSDi4zJ43gLmyGWKlqV0RBmZsI+mzNkWpzznkSezbEoa2UqR+nyrCRWFvUGoCesbvoZwpdQrA8AjE5lkWzc2bETnjV+08LjC0ICJ0D0e+4PSI7bqRxICgm5smtwdB04t89/1O/w1cDnyilFU=`
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/webhook', (req, res) => {
  if (req.method === "POST") {
    if (req.body.events[0].message.type !== "text") {
      reply(req);
    }else if(req.body.events[0].message.type === "image"){

    } else {
      postToDialogflow(req);
    }
  }
  return res.status(200).send(req.method);
});
app.listen(port)
const reply = req => {
  return request({
    method: "POST",
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: JSON.stringify(req.body)
        }
      ]
    })
  });
};
const postToDialogflow = req => {
  req.headers.host = "bots.dialogflow.com";
  return request({
    method: "POST",
    uri: "https://bots.dialogflow.com/line/e0644fb2-4c4e-4135-a857-363e4d566669/webhook",
    headers: req.headers,
    body: JSON.stringify(req.body)
  });
};
const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || []; // se o resultado for undefined (ou seja, sem comentários p/ o post do id fornecido), retornará um array vazio

  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;
  // no objeto comentsByPostId, cria-se uma chave de req.params.id com o valor do comments
  /* { "1d1efbbe": [ {"id": "ca97acea", "content": "First comment"}, {"id": "75af2aed", "content": "Second comment"} ] } */

  await axios.post("http://event-bus-srv:4005/events", { // enviando evento p/ o event bus...
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending'
    },
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Event Received!!!', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find(comment => {
      return comment.id === id;
    })
    comment.status = status;

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status, 
        postId,
        content
      }
    })
  }

  res.send({});
})

app.listen(4001, () => {
  console.log("Listening on 4001");
});

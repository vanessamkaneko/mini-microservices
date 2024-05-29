const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data; // id -> id do post

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data; // id -> id do comment

    const post = posts[postId]; // postId = req.params.id
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
    //atualizando status e conteúdo (já que aqui na query não tem como saber o que está sendo alterado, seria mais por precaução)
  }
};

app.get("/posts", (req, res) => {
  // enviará a lista de posts + comments
  res.send(posts);
});

app.post("/events", (req, res) => {
  // recebimento de eventos do event bus (type: PostCreated e CommentCreated)

  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");
  try {
    const res = await axios.get("http://event-bus-srv:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});

/* a rota da query fica exclusivamente p/ obtenção e processamento dos dados das outras 2 rotas (post e comment); p/ criação de post e comment, usar as respectivas rotas -> lembrar que
apesar de receberem o evento emitido pelo event bus, o post e o comment service não fazem nada com esse evento */

/* formatação da info recebida: posts === 
{
  'j234h3i4': {
    id: 'j234h3i4',
    title: 'post title',
    comments: [
      {
         id: 'kjk3ljd', 
         content: 'comment!'
      }
    ]
  }
} 
*/

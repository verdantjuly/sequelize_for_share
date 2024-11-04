const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const models = require("./models");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/posts", async (req, res) => {
  const { title, content, author } = req.body;
  const post = await models.Post.create({
    title: title,
    content: content,
    author: author,
  });
  res.status(201).json({ post });
});

app.get("/posts", async (req, res) => {
  const posts = await models.Post.findAll({
    include: [{ model: models.Comment }],
  });
  res.json({ data: posts });
});
app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await models.Post.findOne({
    where: { id },
    include: [{ model: models.Comment }],
  });
  if (post) {
    res.status(200).json({ data: post });
  } else {
    res.status(404).json({ data: `post not found` });
  }
});
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const post = await models.Post.findByPk(id);
  if (post) {
    post.title = title;
    post.content = content;
    post.save();
    res.status(200).json({ data: post });
  } else {
    res.status(404).json({ data: `post not found` });
  }
});

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const comment = await models.Comment.create({ PostId: postId, content });
  res.status(201).json({ data: comment });
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await models.Post.findOne({ where: { id } });
  if (post) {
    post.destroy({ where: { id } });
    res.status(200).json({ data: post });
  } else {
    res.status(404).json({ data: `post not found` });
  }
});

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const comment = await models.Comment.findByPk(commentId);
  if (comment) {
    comment.content = content;
    await comment.save();
    res.status(200).json({ data: comment });
  } else {
    res.status(404).json({ result: `comment not found` });
  }
});

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const result = await models.Comment.destroy({ where: { id: commentId } });
  // result 에는 삭제된 개수가 담김
  if (result) {
    res.status(204).json({ result: "comment deleted" });
  } else {
    res.status(404).json({ result: `comment not found` });
  }
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
  models.sequelize
    .sync({ force: false })
    .then(() => {
      console.log(`DB connected`);
    })
    .catch((err) => {
      console.error(`DB error : ${err}`);
      process.exit();
    });
});

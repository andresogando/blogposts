const express = require("express");
const PostDataSource = require("../../../datasources/posts.datasource");
const router = express.Router();

const post = new PostDataSource();
const { client } = require("../../../datasources/redis");
const redis_server = client();

//  api/posts
router.get("/", async (req, res) => {
  try {
    const { tags, sortBy = "id", direction = "desc" } = req.query;

    if (!tags) {
      return res
        .status("400")
        .send("An error has occured: tags field missing!");
    }

    if (
      sortBy &&
      direction &&
      (typeof sortBy != "string" || typeof direction != "string")
    ) {
      return res
        .status("400")
        .send("An error has occured: syntax error on query params!");
    }

    redis_server.get(tags, async (err, POSTS) => {
      if (err) console.error("REDIS-SERVER-ERROR");
      if (POSTS) {
        res.status(200).send({
          POSTS: JSON.parse(POSTS),
          message: "Data From Cache",
        });
        console.log(POSTS);
      } else {
        const POSTS = await post.getPosts(tags, sortBy, direction);
        redis_server.set(tags, JSON.stringify(POSTS));
        console.log(POSTS);
        res.status(200).send(POSTS);
      }
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json(
        `An error has occured: '${err.message}'. We have been notified and will fix the issue shortly!`,
      );
  }
});

module.exports = router;

const express = require("express");
const Exceptions = require("../../../utils");
const PostDataSource = require("../../../datasources/posts.datasource");
const router = express.Router();

const post = new PostDataSource();
const exceptions = new Exceptions();
const { client } = require("../../../datasources/redis");
const redis_server = client();

//  api/posts
router.get("/", async (req, res) => {
  try {
    const { tags, sortBy = "id", direction = "asc" } = req.query;

    if (!tags) {
      throw new Error("Tags param missing!");
    }

    //handle valid QueryParams
    exceptions.handleQueryParams(sortBy, direction);

    redis_server.get(tags, async (err, Posts) => {
      if (err) console.error("REDIS-SERVER-ERROR");
      if (Posts) {
        res.status(200).send({ Posts: JSON.parse(Posts) });
      } else {
        const Posts = await post.getPosts(tags, sortBy, direction);
        redis_server.set(tags, JSON.stringify(Posts));
        res.status(200).send({ Posts });
      }
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json(
        `An error has occured: '${err.message}'. We have been notified and will fix the issue shortly!`
      );
  }
});

module.exports = router;

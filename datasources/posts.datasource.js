const axios = require("axios");
const { URLSearchParams } = require("url");
const _ = require("lodash");

const instance = axios.create({
  baseURL: "https://api.hatchways.io/assessment/",
  timeout: 3000,
});

module.exports = class PostDataSource {
  constructor() {}
  URL = new URLSearchParams();
  promiseArray = [];

  async createPromises(tags, sortBy, direction) {
    // tags array
    const tag = this.parseTags(tags);

    // forEach tag.
    for (const params of tag) {
      this.URL.append("tag", params);

      //fetch and add
      this.URL.append("sortBy", sortBy);
      this.URL.append("direction", direction);

      this.promiseArray.push(
        new Promise(async (resolve, reject) => {
          try {
            const {
              data: { posts },
            } = await instance.get(`/blog/posts?${this.URL.toString()}`);
            console.log("Success:", posts);
            resolve(posts);
          } catch (err) {
            console.warn("error:", err);
            reject(err);
          }
        }),
      );
    }
  }

  // Fetch posts by tags
  async getPostsByTags(tag, sortBy, direction) {
    const _createPromises = await this.createPromises(tag, sortBy, direction);
    const data = [];

    // console.log(this.promiseArray);

    await Promise.all(this.promiseArray).then((res) => data.push(...res));

    //clear duplicates values.
    const newData = this.clearDuplicates(data);

    return newData;
  }

  //   _.uniqBy
  clearDuplicates(arr) {
    return _.uniqBy(arr, "id");
  }

  // Get tags value
  parseTags(tags) {
    const args = tags.split(",");
    return args;
  }

  async getPosts(tags, sortBy, direction) {
    return await this.getPostsByTags(tags, sortBy, direction);
  }
};

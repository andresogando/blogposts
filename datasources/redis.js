const redis = require("redis");
module.exports = {
  client: function () {
    return redis.createClient();
  },
};

const _ = require("lodash");
module.exports = class Exceptions {
  constructor() {}

  handleQueryParams(sortBy, direction) {
    //start validating the values
    const sorts = ["id", "reads", "likes", "popularity"];
    const directions = ["desc", "asc"];
    const isValidSort = _.includes(sorts, sortBy);
    const isValidDirection = _.includes(directions, direction);

    if (!isValidSort) {
      throw new Error("Invalid (sortBy) param!");
    }
    if (!isValidDirection) {
      throw new Error("Invalid (direction) param! ");
    }
  }
};

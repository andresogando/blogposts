const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");

chai.should();
chai.use(chaiHttp);

describe("[GET] /api/posts", () => {
  it("it should return an object incl. at least one tag & 200", (done) => {
    chai
      .request(app)
      .get("/api/posts")
      .query({ tags: "tech,science,health" })
      .end((err, res) => {
        expect(res.body.Posts).to.be.a("array");
        expect(res.body.Posts[0]).to.have.property("tags");
        expect(res.body.Posts[0].tags).to.include("health");
        done();
      });
  }).timeout(5000);
});

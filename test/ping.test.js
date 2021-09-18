const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe("[GET] /api/ping", () => {
  it("it should return 200", (done) => {
    chai
      .request(app)
      .get("/api/ping")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("success").eql(true);
        done();
      });
  });
});

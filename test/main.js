require("dotenv").config();
const expect = require("chai").expect;

const isProduction = process.argv[2] === "--production";

describe("Configurations", () => {
  if (isProduction)
    it("must have a proper secret key", () => {
      expect(process.env.USER_TOKEN_SECRET).not.to.be.equal("super_secret_test_key");
    });

  if (isProduction)
    it("must have production mode enabled", () => {
      expect(process.env.ENV_MODE).to.be.equal("prod");
    });
});

describe("Database connection", () => {});

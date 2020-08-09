import { Express } from "express";
var cloudinary = require("cloudinary").v2;

export default (app: Express) => {
  app.post("/upload", (req, res) => {
    const timestamp = Date.now();
    const apiKey = "";
    const signedUrl = cloudinary.utils.api_sign_request(
      {
        timestamp,
        public_id: "asdf",
      },
      ""
    );
    console.log("signedUrl", signedUrl);
    res.send({ signedUrl, timestamp, apiKey });
  });
};

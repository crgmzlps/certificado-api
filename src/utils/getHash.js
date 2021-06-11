const crypto = require("crypto");

exports.getHash = function (fileContent) {
  return crypto.createHash("sha256").update(fileContent).digest("hex");
};

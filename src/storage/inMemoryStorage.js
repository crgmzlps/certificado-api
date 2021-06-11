const juice = require("juice");
const { v4 } = require("uuid");

const db = [];

exports.loadTemplate = async function (templateCode) {
  try {
    const { template } = db.find((t) => t.id === templateCode);
    if (template) {
      return template;
    }
    return null;
  } catch (e) {
    console.error(e.message);
    return null;
  }
};

exports.saveTemplate = async function (data) {
  try {
    const templateCode = v4();
    const fileContent = await (await data.toBuffer()).toString("utf8");
    const templateWithInlineStyle = juice(fileContent);
    db.push({ id: templateCode, template: templateWithInlineStyle });
    return {
      templateCode,
    };
  } catch (e) {
    console.error(e.message);
    return null;
  }
};

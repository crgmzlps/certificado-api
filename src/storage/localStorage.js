const fs = require("fs").promises;
const { join } = require("path");
const juice = require("juice");
const { v4 } = require("uuid");

const templates = `${join(__dirname, "..", "templates")}`;

async function checkIfFolderExists() {
  try {
    await fs.readdir(templates);
  } catch (e) {
    await fs.mkdir(templates);
  }
}

exports.templatesCleanUp = async function () {
  try {
    await checkIfFolderExists();
    const files = await fs.readdir(templates);
    files.forEach(async (file) => {
      await fs.rm(`${join(templates, file)}`);
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.loadTemplate = async function (templateCode) {
  try {
    await checkIfFolderExists();
    const fileName = `${templateCode}.hbs`;
    const filePath = `${join(templates, fileName)}`;
    const templateContent = await fs.readFile(filePath, "utf-8");
    return templateContent;
  } catch (e) {
    console.error(e.message);
    return null;
  }
};

exports.saveTemplate = async function (data) {
  try {
    await checkIfFolderExists();
    const templateCode = v4();
    const fileName = `${templateCode}.hbs`;
    const filePath = `${join(templates, fileName)}`;
    const fileContent = await (await data.toBuffer()).toString("utf8");
    const templateWithInlineStyles = juice(fileContent);
    await fs.writeFile(filePath, templateWithInlineStyles);
    return {
      templateCode,
    };
  } catch (e) {
    console.error(e.message);
    return null;
  }
};

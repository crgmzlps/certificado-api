const juice = require("juice");
const { v4 } = require("uuid");
const { Storage } = require("@google-cloud/storage");

const { Readable } = require("stream");

const credentials = {
  type: process.env.GOOGLE_STORAGE_TYPE,
  project_id: process.env.GOOGLE_STORAGE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_STORAGE_PRIVATE_ID,
  private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.GOOGLE_STORAGE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_STORAGE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_STORAGE_AUTH_URI,
  token_uri: process.env.GOOGLE_STORAGE_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.GOOGLE_STORAGE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_STORAGE_CLIENT_X509_CERT_URL,
};

async function getBucket() {
  try {
    const gc = new Storage({
      credentials,
      projectId: "certificados-api",
    });
    const bucket = gc.bucket("certificados-do-desafio");
    const [existsBucket] = await bucket.exists();
    if (!existsBucket) {
      await bucket.create();
    }
    return bucket;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

async function getTemplateFromGoogle(templateCode) {
  const bucket = await getBucket();
  if (bucket) {
    const template = bucket.file(templateCode);
    return new Promise((res, rej) => {
      let data = "";
      template
        .createReadStream()
        .on("end", () => {
          res(data);
        })
        .on("data", (chunk) => {
          data += chunk;
        })
        .on("error", (err) => rej(err));
    });
  } else {
    return null;
  }
}

exports.loadTemplate = async function (templateCode) {
  try {
    const templateContent = await getTemplateFromGoogle(templateCode);
    if (templateContent) {
      return templateContent;
    }
    return null;
  } catch (e) {
    console.error(e.message);
    return null;
  }
};

exports.saveTemplate = async function (fileContent) {
  try {
    const bucket = await getBucket();
    if (bucket) {
      const templateCode = v4();
      const templateWithInlineStyle = juice(fileContent);
      const templateStream = Readable.from(templateWithInlineStyle.trim());
      const remoteTemplate = bucket.file(templateCode);
      await new Promise((res, rej) => {
        templateStream
          .pipe(remoteTemplate.createWriteStream())
          .on("error", rej)
          .on("finish", res);
      });
      return remoteTemplate.name;
    }
    return null;
  } catch (e) {
    console.error(e.message);
    return null;
  }
};

const { join } = require("path");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const uuid = require("uuid");

const { Readable } = require("stream");

const gc = new Storage({
  keyFilename: join(__dirname, "certificados-api-790ae192e11e.json"),
  projectId: "certificados-api",
});

async function main() {
  try {
    //const buckets = await gc.getBuckets();
    const bucket = gc.bucket("certificados-do-desafio2");

    const [existsBucket] = await bucket.exists();

    if (!existsBucket) {
      const data = await bucket.create();
      //console.log(data);
    }

    const txt = "<h1>Hello World</h1>";
    const rStream = Readable.from(txt);

    const remoteFile = bucket.file("foo.txt");

    await new Promise((resolve, reject) => {
      rStream
        .pipe(remoteFile.createWriteStream())
        .on("error", reject)
        .on("finish", resolve);
    });

    console.log(remoteFile.name);

    console.log("Done");

    // const remoteFile = bucket.file(uuid.v4());

    // await new Promise((res, rej) => {
    //   fs.createReadStream(join(__dirname, "exemplo-certificado.hbs"))
    //     .pipe(remoteFile.createWriteStream())
    //     .on("error", rej)
    //     .on("finish", res);
    // });

    // console.log({ templateCode: remoteFile.name });

    // const res = await new Promise((res, rej) => {
    //   let data;
    //   remoteFile
    //     .createReadStream()
    //     .on("end", () => {
    //       res(data);
    //     })
    //     .on("data", (chunk) => {
    //       data += chunk;
    //     })
    //     .on("error", (err) => rej(err));
    // });

    // const buffer = Buffer.from(res);

    // console.log(typeof buffer);
    // console.log(buffer);
  } catch (e) {
    console.log(e);
  }
}

main();

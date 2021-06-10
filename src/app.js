require("dotenv").config();

const { ENV } = process.env;

const app = require("fastify")({
  logger: ENV !== "production" ? true : false,
});

const handlebars = require("handlebars");

const { generatePdf } = require("./generatePdf");
const { saveTemplate, loadTemplate } = require("./inMemoryStorage");

app.register(require("fastify-multipart"), {
  limits: {
    fileSize: 50000, // 50 Kb
    files: 1,
  },
});


app.get("/", {}, async (request, reply) => {
  reply.send("API para gerar certificados.");
});

app.post("/templates", {}, async (request, reply) => {
  try {
    const data = await request.file();
    if (data.file) {
      const res = await saveTemplate(data);
      if (res) {
        const { templateCode } = res;
        reply.send({ templateCode });
      } else {
        reply.code(400).send({ error: "Error on store the file" });
      }
    } else {
      reply.code(400).send({ error: "Error on process the file" });
    }
  } catch (e) {
    app.log.error(e.message);
    reply.code(400).send({ error: "File too large" });
  }
});

const certificateSchema = {
  type: "object",
  required: ["name", "course", "templateCode", "date"],
  properties: {
    name: { type: "string" },
    course: { type: "string" },
    templateCode: { type: "string" },
    date: { type: "string" }, // alterar para JSON iSO
  },
};

app.post(
  "/certificados",
  {
    schema: {
      body: certificateSchema,
    },
  },
  async (request, reply) => {
    try {
      const { templateCode, name, course, date } = request.body;
      const fileContent = await loadTemplate(templateCode);
      if (fileContent) {
        const hbsParams = {
          templateCode,
          name,
          course,
          date,
        };
        const html = handlebars.compile(fileContent)(hbsParams);
        const stream = await generatePdf(html);
        reply.type("pdf").send(stream);
      } else {
        throw new Error("Error on load the template");
      }
    } catch (e) {
      app.log.error(e);
      reply.code(500).send({ error: "Error on generate the pdf" });
    }
  }
);

app.setErrorHandler(async (error, request, reply) => {
  app.log.error(error.message);
  reply.code(500).send({ message: "Whoopsss" });
});

module.exports = {
  app,
};

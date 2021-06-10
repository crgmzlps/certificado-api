require("dotenv").config();

const { ENV } = process.env;

const app = require("fastify")({
  logger: ENV !== "production" ? true : false,
});

app.get("/", {}, async (request, reply) => {
  reply.send({ message: "API para gerar certificados." });
});

module.exports = {
  app,
};

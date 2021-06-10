const { app } = require("./app");

const { PORT } = process.env;

async function startApp() {
  await app.listen(PORT);
}

startApp();

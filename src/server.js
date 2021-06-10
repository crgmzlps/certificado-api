const { app } = require("./app");

const { PORT } = process.env;

async function startApp() {
  await app.listen(PORT, "0.0.0.0");
  app.cron.startAllJobs();
}

startApp();

const { app } = require("./app");

const { PORT } = process.env;

async function startApp() {
  await app.listen(PORT);
  app.cron.startAllJobs();
  console.log(`Server listening on ${app.server.address().port}`);
}

startApp();

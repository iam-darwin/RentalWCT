import cluster from "cluster";
import os from "os";
import { app } from "./index";
import { utils } from "./utils/utilities";

// const numCPUs = os.cpus().length;

// if (cluster.isPrimary) {
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//   });
// } else {
//   app.listen(utils.PORT, () => {
//     console.log(
//       `Worker ${process.pid} started and listening on port ${utils.PORT}`
//     );
//   });
// }

app.listen(utils.PORT, () => {
  console.log(
    `Worker ${process.pid} started and listening on port ${utils.PORT}`
  );
});

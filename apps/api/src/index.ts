import { config } from "dotenv";
import { log } from "@repo/logger";
import { createServer } from "./server";
import connectDatabase from "./database/database";

config();

const port = process.env.PORT || 5001;
const server = createServer();

void connectDatabase();

server.listen(port, () => {
  log(`api running on ${port}`);
});

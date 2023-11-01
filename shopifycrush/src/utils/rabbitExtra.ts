import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
import * as Sentry from "@sentry/node";
import { logError } from "./logError";
// import do function
const do_something = (msg: ConsumeMessage | null) => {
  console.log("did" + msg?.content.toString()); // will create own buffer.
};

let conn: Connection | null = null;
let ch: Channel | null = null;
export let initial_success = false;

const q = "mainqueue";

export const connectRabbit = async () => {
  console.log("^ hello connectRabbit function started.");

  try {
    conn = await amqp.connect(process.env.RABBIT_MQ!);
  } catch (err: any) {
    const e = logError(err, "^ couldn't make rabbitmq connection.");
    Sentry.captureException(e);
    console.log("^ trying to make rabbitmq connection in 5/10 sec...");
    setTimeout(connectRabbit, 5000);
    return;
  }

  conn?.once("error", (err) => {
    ch = null;
    conn = null;
    if (err.message === "Connection closing") return;
    const e = logError(err, "^ (on-error) rabbitmq connection closed.");
    Sentry.captureException(e);
  });
  conn?.once("close", () => {
    ch = null;
    conn = null;
    console.log("^ (on-close) rabbitmq connection closed. retrying...");
    Sentry.captureMessage(
      "^ (on-close) rabbitmq connection closed. retrying..."
    );
    setTimeout(connectRabbit, 5000);
  });

  try {
    ch = await conn.createChannel();
    ch.once("error", (err) => {
      const e = logError(err, "^ channel error.");
      Sentry.captureException(e);
    });
    ch.once("close", () => {
      console.log("^ channel closed.");
      Sentry.captureMessage("^ channel closed");
    });
    await ch.assertQueue(q, { durable: true });
    await ch.consume(q, do_something, { noAck: true });
  } catch (err) {
    const e = logError(
      err,
      "^ couldn't create channel / assert Queue / consume."
    );
    Sentry.captureException(e);
    await conn.close();
  }

  initial_success = true;
};

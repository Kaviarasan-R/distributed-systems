import { configDotenv } from "dotenv";
import Express from "express";
import { ServiceBusClient } from "@azure/service-bus";
import Long from "long";

configDotenv({ path: ".env" });

const app = Express();

const sbClient = new ServiceBusClient(process.env.CONNECTION_STRING!);

const queue = process.env.QUEUE1!;

/*
Types of Receiver Modes:
1. Receive and Delete (At-most-once): Message deleted as soon as received.
2. Peek-Lock (At-least-once): Message locked, processed, then deleted on confirmation. Must handle de-duplication scenarios. 
*/

const receiver1 = sbClient.createReceiver(queue, {
  receiveMode: "peekLock",
  maxAutoLockRenewalDurationInMs: 5 * 60 * 1000,
});
const receiver2 = sbClient.createReceiver(queue, { receiveMode: "peekLock" });

const receiverDLQ = sbClient.createReceiver(queue, {
  receiveMode: "receiveAndDelete",
  subQueueType: "deadLetter",
});

let lastLockedMessage: any = null;

// --- Batch Produce ---
app.get("/produce/batch", async (req, res) => {
  const messages = [
    { body: "Message 1" },
    { body: "Message 2" },
    {
      body: "A".repeat(300 * 1024), // 300 KB of data
    },
    { body: "Message 3" },
  ];

  const sender = sbClient.createSender(queue);
  let batch = await sender.createMessageBatch({ maxSizeInBytes: 256 * 1024 }); // Max-size per message: 256kb

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    if (!batch.tryAddMessage(message)) {
      console.log("Failed Message:", message);
      // If true, message added to batch.
      await sender.sendMessages(batch); // Returns batch, due to it fails to add next message.

      batch = await sender.createMessageBatch(); // Creates new batch and try to add current message.

      if (!batch.tryAddMessage(messages[i])) {
        throw new Error("Message too big to fit in a batch");
      }
    }

    console.log("Success Message:", message);
  }

  await sender.sendMessages(batch); // Send whatever is left in the batch
  await sender.close();
  res.json({ message: `Produced Message in Batch` });
});

// --- Scheduled Message ---
app.get("/produce/schedule", async (req, res) => {
  const messages = [
    { body: "Message 100" },
    { body: "Message 101" },
    { body: "Message 102" },
  ];
  const scheduleTimeUtc = new Date(Date.now() + 5 * 60 * 1000);

  const sender = sbClient.createSender(queue);
  const sequenceNumbers = await sender.scheduleMessages(
    messages,
    scheduleTimeUtc
  );

  console.log("Scheduled message for:", scheduleTimeUtc.toLocaleString());
  console.log("sequenceNumbers", sequenceNumbers);

  // await sender.cancelScheduledMessages([new Long(62)]);
  await sender.close();
  res.json({ message: `Scheduled Message` });
});

// --- Produce a message ---
app.get("/produce/:index", async (req, res) => {
  const index = Number(req.params.index) || 0;
  const sender = sbClient.createSender(queue);
  await sender.sendMessages({ body: `Message-${index}` });
  await sender.close();
  res.json({ message: `Produced Message-${index}` });
});

// --- Receiver 1 (Peek Mode) ---
// When the lock expires, the message becomes visible again to other receivers, but not to the same receiver when using receiveMessages()
app.get("/receiver1/peek-mode/:index", async (req, res) => {
  console.log("Receiver 1 attempting to peek...");

  const index: number = Number(req.params.index) || 0;
  const messages = await receiver1.peekMessages(1, {
    fromSequenceNumber: new Long(index),
  });

  if (messages.length === 0) {
    console.log("Receiver 1: No messages active.");
    return res.json({ status: "no-active-message" });
  }

  const msg = messages[0];
  console.log(`Receiver 1 peeked: ${msg.body}`);
  res.json({ receiver: "receiver1", body: msg.body });
});

// --- Receiver 1 (Deferred Mode) ---
app.get("/receiver1/deferred-mode/:index", async (req, res) => {
  console.log("Receiver 1 attempting to receive defer...");

  const index: number = Number(req.params.index) || 0;
  const messages = await receiver1.receiveDeferredMessages(new Long(index)); // Default lock 30s

  if (messages.length === 0) {
    console.log("Receiver 1: No messages active.");
    return res.json({ status: "no-active-message" });
  }

  const msg = messages[0];
  console.log(`Receiver 1 peeked: ${msg.body}`);

  await receiver1.completeMessage(msg);
  res.json({ receiver: "receiver1", body: msg.body });
});

// --- Receiver 1 (Peek-Lock Mode) ---
// If this receiver didn't call the /release in lock phase then this message won't able to see it again until the receiver connection restarts.
app.get("/receiver1", async (req, res) => {
  console.log("Receiver 1 attempting to receive...");
  const messages = await receiver1.receiveMessages(1, {
    maxWaitTimeInMs: 5000,
  });

  if (messages.length === 0) {
    console.log("Receiver 1: No messages available.");
    return res.json({ status: "empty" });
  }

  const msg = messages[0];
  lastLockedMessage = msg;

  console.log(`Receiver 1 locked message: ${msg.body}`);
  console.log(
    `Lock expires at: ${new Date(msg?.lockedUntilUtc ?? "").toLocaleString()}`
  );

  const renewedLock = await receiver1.renewMessageLock(msg); // Lock for another default 1 min or 'maxAutoLockRenewalDurationInMs'.
  console.log("Renewed Lock at:", new Date(renewedLock).toLocaleString());

  res.json({
    receiver: "receiver1",
    body: msg.body,
    lockExpires: msg.lockedUntilUtc,
  });
});

// --- Receiver 1: Release ("ABANDON" | "COMPLETE" | "DEFER" | "DEAD") ---
// Must called when the message in Lock State by Receiver 1
app.get("/receiver1/release", async (req, res) => {
  if (!lastLockedMessage) {
    return res.json({ error: "No message locked yet" });
  }

  console.log("Release Message:", lastLockedMessage.body);

  const action = (req.query.action as string)?.toUpperCase() || "COMPLETE";
  if (action === "ABANDON") {
    // The lock held on the message by the receiver is let go, making the message available.
    await receiver1.abandonMessage(lastLockedMessage);
    console.log("Receiver 1 abandoned the message.");
  } else if (action === "COMPLETE") {
    // Removes the message from Service Bus.
    await receiver1.completeMessage(lastLockedMessage);
    console.log("Receiver 1 completed the message (deleted).");
  } else if (action === "DEFER") {
    // The message has either been deleted or already settled
    // Save the sequenceNumber of the message, in order to receive it message again in the future using the receiveDeferredMessage() method.
    const deferredMessage = await receiver1.deferMessage(lastLockedMessage);
    console.log("Receiver 1 deferred the message (postpone).", deferredMessage);
  } else if (action === "DEAD") {
    // Moves the message to the deadletter sub-queue. To receive a deadletted message, create a new QueueClient/SubscriptionClient using the path for the deadletter sub-queue.
    await receiver1.deadLetterMessage(lastLockedMessage);
    console.log("Receiver 1 moved the message to DLQ.");
  }

  lastLockedMessage = null;
  res.json({ action, done: true });
});

// --- Receiver 2 (Peek-Lock Mode) ---
// As soon as Receiver 1 locks message A, Receiver 2 will get message B (if it exists).
// Only when both receivers use receiveMessages() in peekLock mode—because each call retrieves and locks the next available message in the queue rather than peeking at existing ones.
// If this receiver didn't call the /release in lock phase then this message won't able to see it again until the receiver connection restarts.
app.get("/receiver2", async (req, res) => {
  console.log("Receiver 2 attempting to receive...");
  const messages = await receiver2.receiveMessages(1, {
    maxWaitTimeInMs: 5000,
  });

  if (messages.length === 0) {
    console.log("Receiver 2: No messages (probably locked by receiver1).");
    return res.json({ status: "no-visible-message" });
  }

  const msg = messages[0];
  console.log(`Receiver 2 received: ${msg.body}`);
  res.json({ receiver: "receiver2", body: msg.body });
});

// --- Receiver DLQ (DLQ Mode) ---
app.get("/receiverDLQ/dlq-mode/:index", async (req, res) => {
  console.log("Receiver DLQ attempting to receive...");

  const index: number = Number(req.params.index) || 0;
  const messages = await receiverDLQ.peekMessages(1, {
    fromSequenceNumber: new Long(index),
  });

  if (messages.length === 0) {
    console.log("Receiver DLQ: No messages active.");
    return res.json({ status: "no-active-message" });
  }

  const msg = messages[0];
  console.log(`Receiver DLQ peeked: ${msg.body}`);

  await receiverDLQ.completeMessage(msg);
  res.json({ receiver: "receiverDLQ", body: msg.body });
});

async function consumer() {
  receiver1.subscribe({
    async processMessage(message) {
      console.log(`Message Consumer: ${message.body}`);
    },
    async processError(args) {
      console.log(
        `Error occurred with ${args.entityPath} within ${args.fullyQualifiedNamespace}: `,
        args.error
      );
    },
  });

  // for await (let message of receiver.getMessageIterator()) {
  //   console.log("Message Iterator:", message.body);
  // }
}

process.on("SIGINT", async () => {
  await receiver1.close();
  await receiver2.close();
  await sbClient.close();
  console.log("Closed all connections.");
  process.exit(0);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`App running on port ${process.env.PORT}`);
});

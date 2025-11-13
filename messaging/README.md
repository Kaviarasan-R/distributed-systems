# Message Systems

Distributed systems use different kinds of communication mechanisms depending on their purpose.
Below are the major categories of messaging and communication platforms with their key goals and representative tools.

- Message Brokers / Queues:
  Reliable asynchronous communication between producers and consumers — used to decouple microservices and handle message delivery.
  Examples: Azure Service Bus, RabbitMQ, Amazon SQS, Google Pub/Sub, ActiveMQ, IBM MQ, NATS

- Event Streaming Platforms:
  High-throughput, real-time data pipelines with replayable event logs — designed for event sourcing, analytics, and continuous data flow.
  Examples: Apache Kafka, AWS Kinesis

- Job Queues / Task Queues:
  Background job execution within applications — handles retries, scheduling, and delayed tasks.
  Examples: BullMQ, Celery

- Transport Protocols / RPC Systems:
  Direct, synchronous communication between services — ideal for request/response patterns and low-latency RPC calls.
  Examples: HTTP, gRPC, TCP, WebSocket, AMQP, MQTT

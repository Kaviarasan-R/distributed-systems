# Distributed Systems

Distributed systems are composed of many interdependent layers — from messaging and coordination to storage and orchestration.
Below is a categorized map of major domains, concepts, and representative tools in the distributed systems ecosystem.

## Architectures of Distributed systems

Below are some of the common distributed system architectures:

- Client-Server Architecture:
  In this setup, servers provide resources or services, and clients request them. Clients and servers communicate over a network.
  Examples: Web applications, where browsers (clients) request pages from web servers.

- Peer-to-Peer (P2P) Architecture:
  Each node, or "peer," in the network acts as both a client and a server, sharing resources directly with each other.
  Examples: File-sharing networks like BitTorrent, where files are shared between users without a central server.

- Three-Tier Architecture:
  This model has three layers: presentation (user interface), application (business logic), and data (database). Each layer is separated to allow easier scaling and maintenance.
  Examples: Many web applications use this to separate user interfaces, logic processing, and data storage.

- Microservices Architecture:
  The application is split into small, independent services, each handling specific functions. These services communicate over a network, often using REST APIs or messaging.
  Examples: Modern web applications like Netflix or Amazon, where different services handle user accounts, orders, and recommendations independently.

- Service-Oriented Architecture (SOA):
  Similar to microservices, SOA organizes functions as services. However, SOA typically uses an enterprise service bus (ESB) to manage communication between services.
  Examples: Large enterprise applications in finance or government, where different services handle various aspects of business processes.

- Event-Driven Architecture:
  Components interact by sending and responding to events rather than direct requests. An event triggers specific actions or processes in various parts of the system.
  Examples: Real-time applications like IoT systems, where sensors trigger actions based on detected events.

## Communications & Concepts

- Messaging & Event Systems:
  Asynchronous communication, Publish/Subscribe (Pub/Sub), Message Queues.
  Examples: RabbitMQ, Kafka, Azure Service Bus, Google Pub/Sub, NATS

  | **Method**       | **Type**    | **Who Initiates**    | **Use Case**                      |
  | ---------------- | ----------- | -------------------- | --------------------------------- |
  | **Polling**      | Pull        | Receiver             | You call the API periodically     |
  | **Webhook**      | Push        | Sender               | They send to your endpoint        |
  | **Long Polling** | Hybrid      | Receiver (held open) | Near real-time updates            |
  | **WebSocket**    | Full-duplex | Both                 | Continuous, low-latency messaging |

- Coordination & Consensus:
  Leader election, configuration management, distributed locking, service discovery.
  Examples: ZooKeeper, etcd, Consul, Raft, Paxos

- Distributed Databases:
  Data replication, sharding, partition tolerance, eventual consistency
  Examples: Cassandra, MongoDB, CockroachDB, Google Spanner

- Task Scheduling & Job Systems:
  Background job processing, retries, delayed tasks, distributed task queues
  Examples: BullMQ, Celery, Apache Airflow, Temporal

- Distributed File Systems & Storage:
  Shared data access across nodes, high availability, replication
  Examples: HDFS, Ceph, Amazon S3, Google File System (GFS)

- RPC & Service Communication:
  Low-latency service-to-service calls, API communication
  Examples: gRPC, Apache Thrift, REST, GraphQL

- Load Balancing & Service Mesh:
  Intelligent request routing, retries, observability, traffic splitting
  Examples: Envoy, Istio, Linkerd, HAProxy

- Distributed Coordination Frameworks:
  Workflow orchestration, distributed task management, long-running processes
  Examples: Temporal, Cadence, Argo Workflows

- Streaming & Real-time Pipelines:
  Log-based dataflow, event sourcing, real-time analytics, data replay
  Examples: Apache Kafka, Apache Flink, Spark Streaming, AWS Kinesis

- Consistency & Fault Tolerance:
  CAP theorem, Quorum-based systems, retry mechanisms, failure recovery
  Examples: Raft, Paxos, Two-Phase Commit (2PC), Saga Pattern

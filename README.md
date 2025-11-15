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
  Leader election, Master slave, configuration management, distributed locking, service discovery.
  Examples: ZooKeeper

- Distributed Databases:
  Data replication, sharding, partition tolerance, eventual consistency
  Examples: Cassandra, MongoDB

- Task Scheduling & Job Systems:
  Background job processing, retries, delayed tasks, distributed task queues
  Examples: BullMQ, Celery

- Distributed File Systems & Storage:
  Shared data access across nodes, high availability, replication
  Examples: HDFS, Amazon S3

- RPC & Service Communication:
  Low-latency service-to-service calls, API communication
  Examples: gRPC, REST, GraphQL

- Load Balancing & Service Mesh:
  Intelligent request routing, retries, observability, traffic splitting
  Examples: Envoy, Istio, Linkerd, HAProxy

- Distributed Coordination Frameworks:
  Workflow orchestration, distributed task management, long-running processes
  Examples: Temporal, Cadence, Argo Workflows

- Streaming & Real-time Pipelines:
  Log-based dataflow, event sourcing, real-time analytics, data replay
  Examples: Apache Kafka, Spark Streaming, AWS Kinesis

- Consistency & Fault Tolerance:
  CAP theorem, Quorum-based systems, retry mechanisms, failure recovery
  Examples: Raft, Paxos, Two-Phase Commit (2PC), Saga Pattern

## Mastering Distributed Systems

Distributed systems span far more than messaging. They involve architecture, communication, orchestration, consistency, reliability, and the infrastructure that keeps everything running smoothly.
Below is a comprehensive, readable overview of the major areas you should understand to truly master distributed systems.

- Containerization & Orchestration:
  Modern distributed systems run inside containers so they can be packaged, shipped, and deployed consistently.
  Container orchestration platforms manage these containers across clusters of machines.

  Key Concepts:
  Containerization, container orchestration, service discovery, ingress, scaling, health checks.
  Tools to explore: Docker, Kubernetes (K8s), Kubernetes DNS, [Nginx, Traefik, Kong, Istio Gateway] (Manage external traffic, security, and routing into clusters).

  | Concept                     | Tools                                 |
  | --------------------------- | ------------------------------------- |
  | **Containerization**        | Docker, Podman                        |
  | **Container Orchestration** | Kubernetes (K8s), Docker Swarm, Nomad |
  | **Service Discovery**       | Kubernetes DNS, Consul                |
  | **Ingress & API Gateways**  | Nginx, Traefik, Kong, Istio Gateway   |

- Networking, Load Balancing & Gateways:
  Distributed systems rely heavily on smart networking layers to route requests, balance loads, throttle traffic, and ensure resiliency.

  Key Concepts:
  Reverse proxies, load balancing, rate limiting, SSL termination, circuit breaking, retries, service meshes.

  | Purpose                           | Examples                                           |
  | --------------------------------- | -------------------------------------------------- |
  | **Reverse Proxy & Load Balancer** | Nginx, HAProxy, Envoy                              |
  | **API Gateway / Rate Limiter**    | Kong, Traefik, AWS API Gateway, Express Gateway    |
  | **Service Mesh**                  | Istio, Linkerd, Consul Connect                     |
  | **Circuit Breaking & Retries**    | Resilience4J, Envoy, Istio features                |
  | **Rate Limiting**                 | Nginx, Kong, Envoy filters, Redis-based algorithms |

- Infrastructure as Code & DevOps Foundations:
  Large-scale systems require automated provisioning, deployment, and configuration.
  Infrastructure as Code (IaC) and CI/CD pipelines ensure consistency and smooth delivery.

  Key Concepts:
  Declarative infrastructure, automated deploys, rollout strategies, config management.
  Tools to explore: Terraform, Pulumi, GitHub Actions, Jenkins, ArgoCD, Ansible.

  | Domain                                                                   | Tools                                   |
  | ------------------------------------------------------------------------ | --------------------------------------- |
  | **Infrastructure as Code (IaC)**                                         | Terraform, Pulumi, AWS CloudFormation   |
  | **Continuous Integration / Deployment (CI/CD)**                          | GitHub Actions, Jenkins, ArgoCD, Tekton |
  | **Configuration Management** (Maintain consistency across environments ) | Ansible, Chef, Puppet                   |

- Observability & Monitoring:
  You cannot run distributed systems blindly. You need visibility into logs, metrics, and traces flowing across nodes.

  Key Concepts:
  Centralized logging, time-series metrics, distributed tracing, alerting, dashboards.
  Tools to explore: Prometheus, Grafana, Jaeger, Zipkin, ELK Stack, Loki.

  | Area         | Tools                                             | Description                            |
  | ------------ | ------------------------------------------------- | -------------------------------------- |
  | **Logging**  | ELK Stack (Elasticsearch, Logstash, Kibana), Loki | Collect and query distributed logs     |
  | **Metrics**  | Prometheus, Grafana                               | Monitor performance and resource usage |
  | **Tracing**  | OpenTelemetry, Jaeger, Zipkin                     | Trace requests across microservices    |
  | **Alerting** | Alertmanager, Grafana Alerts                      | Notify on anomalies or failures        |

- Caching & Data Acceleration:
  Caching drastically improves latency and reduces load in distributed environments.
  It can happen at the app layer, edge layer, or data layer.

  Key Concepts:
  Distributed cache, in-memory data stores, CDN caching, query caching.
  Tools to explore: Redis, Memcached, Cloudflare, Fastly.

  | Purpose                | Examples                    |
  | ---------------------- | --------------------------- |
  | **In-memory Cache**    | Redis, Memcached            |
  | **Edge Caching / CDN** | Cloudflare, Akamai, Fastly  |
  | **Query-level Cache**  | Druid, Presto, ElasticCache |

- Security & Authentication:
  Security becomes far more complex when multiple services communicate over networks.
  Authentication and secret management are core skills.

  Key Concepts:
  OAuth2, identity management, mTLS, zero-trust networking, API keys, WAFs, secrets management.
  Tools to explore: Keycloak, Vault, AWS Secrets Manager, SPIFFE/SPIRE.

  | Layer                           | Concepts / Tools                      |
  | ------------------------------- | ------------------------------------- |
  | **Auth & Identity**             | OAuth2, OpenID Connect, JWT, Keycloak |
  | **Service-to-Service Security** | mTLS (mutual TLS), SPIFFE/SPIRE       |
  | **Secrets Management**          | HashiCorp Vault, AWS Secrets Manager  |
  | **API Security**                | API keys, rate limiting, WAFs         |

- Distributed Algorithms & Theoretical Foundations:
  Deep mastery of distributed systems requires understanding the algorithms and constraints that power them.

  Key Concepts:
  CAP theorem, consensus algorithms, quorums, vector clocks, gossip protocols, distributed transactions, leader election.
  Algorithms & patterns: Raft, Paxos, 2PC, 3PC, Saga Pattern, Lamport clocks.

  | Concept                                | Why it matters                                                    |
  | -------------------------------------- | ----------------------------------------------------------------- |
  | **CAP Theorem**                        | Trade-offs between Consistency, Availability, Partition tolerance |
  | **Consensus Algorithms**               | Foundation of coordination and leader election (Raft, Paxos)      |
  | **Quorum and Replication**             | Data consistency in distributed databases                         |
  | **Vector Clocks / Lamport Timestamps** | Ordering events without global clock                              |
  | **Gossip Protocols**                   | Node discovery and health propagation                             |
  | **2PC / 3PC / Saga Pattern**           | Distributed transactions                                          |
  | **Eventual Consistency Models**        | How data syncs in large-scale systems                             |

- Serverless & Cloud-Native Extensions:
  Serverless platforms add elasticity and automation to distributed systems, making them scale seamlessly.

  Key Concepts:
  Event-driven execution, ephemeral compute, automatic scaling.
  Platforms to explore: AWS Lambda, Azure Functions, Google Cloud Functions, EventBridge.

  | Domain                        | Examples                                            |
  | ----------------------------- | --------------------------------------------------- |
  | **Serverless Functions**      | AWS Lambda, Azure Functions, Google Cloud Functions |
  | **Event-Driven Integrations** | EventBridge, CloudEvents                            |
  | **Cloud-Native Messaging**    | AWS SNS/SQS, Azure Event Grid, Google Pub/Sub       |

- Testing & Chaos Engineering:
  Distributed systems fail in surprising ways.
  Testing them involves simulating unpredictable failures and load.

  Key Concepts:
  Fault injection, traffic replay, chaos experiments, resilience testing, load generation.
  Tools to explore: Chaos Monkey, LitmusChaos, Gremlin, k6, Locust.

  | Concept               | Tools                           |
  | --------------------- | ------------------------------- |
  | **Chaos Engineering** | Chaos Monkey, LitmusChaos       |
  | **Load Testing**      | k6, Locust, JMeter              |
  | **Fault Injection**   | Gremlin, Istio fault simulation |

- Distributed Design Patterns:
  A set of battle-tested architectural patterns exists specifically to tame the complexity of distributed systems.

  Patterns to learn:
  Saga, Event Sourcing, CQRS, Outbox pattern, Circuit Breaker, Retry with Backoff, Bulkhead Isolation, Idempotency, Sharding, Leader Election, Sidecar pattern.

export const profile = {
  name: "Abdulaziz Toba",
  handle: "aziztoba",
  title: "AI Engineer",
  domain: "aziztoba.github.io",
  introduction:
    "AI engineer building self-hosted LLM systems, agent workflows, and inference infrastructure, backed by production experience in C#/.NET and distributed services.",
  email: "abdulaziztoba@outlook.com",
  github: "https://github.com/aziztoba",
  linkedin: "https://www.linkedin.com/in/aziztoba",
  resume: "/Abdulaziz_Toba_AI_Engineer_CV.pdf",
};
export const experience = [
  {
    company: "INVENTO",
    period: "Jan 2025 — Present",
    role: "Senior Software Engineer → AI Engineer",
    description:
      "Agentic LLM workflows, voice-agent integration, local-model summarization and generation, inference benchmarking, and production C#/.NET services.",
  },
  {
    company: "MANNAI / Qatar MEC",
    period: "Jan 2023 — Jan 2025",
    role: "Senior Software Engineer",
    description:
      "Backend services for Qatar’s National Super App and MEC. Digital Falcon / CITES integration, Camping Permit validation and geolocation, architecture and code review.",
  },
  {
    company: "APEX SYSTEMS",
    period: "Jul 2019 — Jan 2023",
    role: "Senior Software Engineer",
    description:
      ".NET and C# applications with CQRS, Hexagonal Architecture, Redis caching, SignalR, production monitoring and engineering mentorship.",
  },
];
export const education = {
  school: "6 October Academy",
  degree: "Bachelor’s Degree in Engineering",
  date: "Jun 2018",
};
export const skills = {
  "ai / llm": [
    "Self-hosted LLMs",
    "LangChain",
    "LangGraph",
    "Hugging Face",
    "Vector databases",
    "AI agents",
    "Summarization",
    "Text / image generation",
  ],
  inference: [
    "Model serving",
    "Quantization",
    "Continuous batching",
    "GPU / VRAM sizing",
    "TTFT",
    "Tokens / second",
    "Concurrent inference",
    "Context / memory planning",
  ],
  backend: [
    "C#",
    ".NET",
    "ASP.NET Core",
    "REST APIs",
    "SQL Server",
    "EF Core",
    "Dapper",
    "Redis",
    "CQRS",
    "Microservices",
    "SignalR",
    "gRPC",
  ],
  tools: ["Angular", "TypeScript", "Azure", "AWS", "Prometheus", "Grafana"],
};
export type Project = {
  id: string;
  name: string;
  summary: string;
  kind: "professional" | "public";
  organization: string;
  stack: string[];
  details: string[];
  visual: "voice" | "review" | "meeting" | "permits" | "inference" | "code";
  repo?: string;
  featured?: boolean;
  parent?: string;
};
export const projects: Project[] = [
  {
    id: "voice-agent",
    name: "Voice Agent",
    kind: "professional",
    organization: "INVENTO",
    featured: true,
    visual: "voice",
    stack: ["LLM integration", "LangChain", "LangGraph", "Self-hosted models"],
    summary:
      "Local-model conversation workflows connected to production backend services.",
    details: [
      "Developed the LLM integration and conversation workflows for a voice agent.",
      "Orchestrated agentic flows with LangChain and LangGraph.",
      "Integrated local / self-hosted language models with backend services.",
    ],
  },
  {
    id: "ai-code-review",
    name: "AI Code Review",
    kind: "professional",
    organization: "INVENTO",
    featured: true,
    visual: "review",
    stack: ["C#", ".NET 8", "LLM APIs", "Background workers", "SQL Server"],
    summary:
      "AI-assisted pull-request review, from changed code to structured findings.",
    details: [
      "Worked on a layered ASP.NET Core review service with asynchronous job processing.",
      "Integrated language-model review with structured findings and severity-based outcomes.",
      "Repository inspection confirms application, domain, infrastructure and API boundaries.",
    ],
  },
  {
    id: "meeting-platform",
    name: "Meeting Platform",
    kind: "professional",
    organization: "INVENTO",
    featured: true,
    visual: "meeting",
    stack: ["C#", ".NET", "EF Core", "Redis", "SignalR"],
    summary:
      "Production backend engineering for meetings, approvals and collaboration.",
    details: [
      "Built and maintained backend services for meeting and approval workflows.",
      "Worked across persistence, caching, notifications and service integrations.",
      "Applied local-model summarization and localized generation in professional AI work.",
    ],
  },
  {
    id: "mec-services",
    name: "MEC e-Services",
    kind: "professional",
    organization: "MANNAI / Qatar MEC",
    featured: true,
    visual: "permits",
    stack: ["C#", "ASP.NET Core", "SQL Server", "Dapper", "Angular"],
    summary:
      "Government service workflows for Qatar’s National Super App and MEC.",
    details: [
      "Designed Digital Falcon services and CITES integration for regulatory workflows.",
      "Delivered Camping Permit features with dynamic validation and geolocation.",
      "Contributed architecture decisions, technical design and code reviews.",
    ],
  },
  {
    id: "permit-extraction",
    name: "Permit Extraction",
    kind: "professional",
    organization: "INVENTO",
    parent: "more",
    visual: "permits",
    stack: [
      ".NET 8",
      "Document Intelligence",
      "Azure OpenAI",
      "Structured output",
    ],
    summary:
      "Document-processing work combining OCR with structured language-model output.",
    details: [
      "The inspected project combines document layout extraction with semantic field mapping.",
      "Typed output contracts organize extracted fields for backend consumption.",
      "Only a high-level illustrative overview is public; no real documents or extracted records are included.",
    ],
  },
  {
    id: "local-inference",
    name: "Local LLM Inference",
    kind: "professional",
    organization: "INVENTO",
    parent: "more",
    visual: "inference",
    stack: ["Model serving", "Quantization", "Batching", "GPU / VRAM"],
    summary:
      "Inference engineering across latency, throughput and memory constraints.",
    details: [
      "Evaluated GPU / VRAM sizing, quantization and context-memory tradeoffs.",
      "Benchmarked TTFT, tokens per second, throughput and memory utilization.",
      "Worked with batching, continuous batching and concurrent inference. No unverified benchmark values are published.",
    ],
  },
  {
    id: "drip-scheduler",
    name: "drip-scheduler",
    kind: "public",
    organization: "Public project",
    parent: "more",
    visual: "meeting",
    repo: "drip-scheduler",
    stack: ["TypeScript", "Next.js", "React"],
    summary:
      "Course delivery with scheduled content, creator tools and member progress.",
    details: [
      "Public repository contains creator and member experiences, course/module editing and progress tracking.",
      "Includes scheduled unlock/notification routes and platform integration.",
    ],
  },
  {
    id: "Luftborn",
    name: "Luftborn",
    kind: "public",
    organization: "Technical exercise",
    parent: "more",
    visual: "code",
    repo: "Luftborn",
    stack: ["C#", "ASP.NET Core", "CQRS"],
    summary:
      "Layered backend exercise with command/query handlers and validation.",
    details: [
      "Application, domain, persistence and API projects separate responsibilities.",
      "Includes request validators, authentication services and exception middleware.",
    ],
  },
  {
    id: "MediatorFromScratch",
    name: "MediatorFromScratch",
    kind: "public",
    organization: "Engineering example",
    parent: "more",
    visual: "code",
    repo: "MediatorFromScratch",
    stack: ["C#", ".NET", "Dependency injection"],
    summary:
      "A small mediator implementation with request and handler contracts.",
    details: [
      "Explores request dispatch and handler resolution.",
      "Includes a dependency-injection project and runnable samples.",
    ],
  },
  {
    id: "BenchmarkExample",
    name: "BenchmarkExample",
    kind: "public",
    organization: "Engineering example",
    parent: "more",
    visual: "inference",
    repo: "BenchmarkExample",
    stack: ["C#", "BenchmarkDotNet"],
    summary: "Date-parser benchmarking with BenchmarkDotNet.",
    details: [
      "Public example contains a parser, benchmark fixture and executable runner.",
      "An engineering exercise, not a claim of production performance improvement.",
    ],
  },
  {
    id: "AzureServiceBusDemo",
    name: "AzureServiceBusDemo",
    kind: "public",
    organization: "Engineering example",
    parent: "more",
    visual: "code",
    repo: "AzureServiceBusDemo",
    stack: ["C#", "Azure Service Bus", "Asynchronous messaging"],
    summary:
      "Topic and subscription messaging with producer/consumer examples.",
    details: [
      "Demonstrates publishing events to a topic and consuming subscriptions.",
      "Includes separate contracts, producer and consumer projects.",
    ],
  },
  {
    id: "BehaviorDrivenDevelopment",
    name: "BehaviorDrivenDevelopment",
    kind: "public",
    organization: "Engineering example",
    parent: "more",
    visual: "code",
    repo: "BehaviorDrivenDevelopment",
    stack: ["C#", "BDD", "SpecFlow"],
    summary: "Behavior-driven pricing tests with readable feature scenarios.",
    details: [
      "Feature files and step definitions exercise a pricing service.",
      "Public sample demonstrates specification-driven testing.",
    ],
  },
];
export const entries = [
  { id: "about", label: "whoami" },
  ...projects
    .filter((p) => p.featured)
    .map((p) => ({ id: p.id, label: p.name })),
  { id: "experience", label: "experience/" },
  { id: "more", label: "more/" },
  { id: "stack", label: "stack/" },
  { id: "themes", label: "themes/" },
];

export const company = {
  name: "Byte Analytics",
  eyebrow: "Data engineering · ML engineering · AI",
  headlineLead: "Data platforms, ML systems and AI",
  headlineAccent: "that run in production.",
  summary:
    "We build the data platforms, machine learning systems and AI products that run in production — on Databricks, AWS and Snowflake. One team takes you from the first pipeline to a monitored model in production.",
  experience: ["Databricks", "AWS", "Snowflake", "Azure", "Kubernetes", "UiPath", "MuleSoft"],
  industries: ["Energy", "Oil & gas", "Financial services"],
};

// Leave a value empty ("") to hide it on the site until it is confirmed.
export const contact = {
  legalName: "Byte Analytics Private Ltd.",
  email: "info@byteanalytics.co.in",
  phone: "",
  address: {
    lines: [
      "Awfis Space Solutions Pvt. Ltd, 1st–4th Floor",
      "Loven Tiara, Kothaguda Junction, Kondapur",
      "Hyderabad, Telangana 500084",
    ],
    streetAddress: "Awfis Space Solutions Pvt. Ltd, 1st–4th Floor, Loven Tiara, Kothaguda Junction, Kondapur",
    locality: "Hyderabad",
    region: "Telangana",
    postalCode: "500084",
    country: "IN",
  },
  locations: ["Hyderabad"],
  linkedin: "",
  // Calendly or Microsoft Bookings link. Without one, the button opens an email request.
  bookingUrl: "",
};

export function bookingHref(): string {
  if (contact.bookingUrl) return contact.bookingUrl;
  const subject = encodeURIComponent("Request a 30-minute call");
  return `mailto:${contact.email}?subject=${subject}`;
}

export const nav = [
  { id: "services", label: "Services" },
  { id: "case-studies", label: "Case studies" },
  { id: "private-ai", label: "Private AI" },
  { id: "accelerators", label: "AI Accelerators" },
  { id: "about", label: "About" },
  { id: "packages", label: "Packages" },
  { id: "contact", label: "Contact" },
] as const;

export const stats = [
  { value: 25, from: 80, prefix: "80→", suffix: " min", label: "Production pipeline runtime" },
  { value: 40, from: 0, prefix: "30–", suffix: "%", label: "Faster jobs after Hadoop → Databricks" },
  { value: 50, from: 0, prefix: "", suffix: "%", label: "Faster pipeline builds" },
];

export const services = [
  {
    title: "Data Engineering",
    body: "Reliable batch and streaming pipelines that deliver clean, tested, on-time data to the teams and models that depend on it.",
    tags: ["Pipelines", "Streaming", "Data quality"],
  },
  {
    title: "Lakehouse (Databricks / Snowflake)",
    body: "Lakehouse and warehouse platforms designed for scale and governance, including migrations from Hadoop and legacy warehouses.",
    tags: ["Databricks", "Snowflake", "Lakeflow"],
  },
  {
    title: "ML Engineering & MLOps",
    body: "We take models out of notebooks and into production: automated deployment, CI/CD for ML, serving on Kubernetes and continuous monitoring.",
    tags: ["Model deployment", "Kubernetes / KServe", "CI/CD for ML", "Monitoring"],
  },
  {
    title: "AI & GenAI",
    body: "Retrieval-augmented generation, agents and LLM applications grounded in your own data, with evaluation and guardrails built in.",
    tags: ["RAG", "Agents", "LLM systems"],
  },
  {
    title: "Cloud & DevOps",
    body: "Secure, cost-aware cloud foundations on AWS and Azure, with infrastructure as code and automated delivery pipelines.",
    tags: ["AWS", "Azure", "Infrastructure as code"],
  },
  {
    title: "Automation & Integration",
    body: "UiPath process automation and MuleSoft integration that reduce manual effort and keep data moving between systems.",
    tags: ["UiPath", "MuleSoft", "RPA"],
  },
];

export const caseStudies = [
  {
    client: "US oil & gas operator",
    title: "Cutting a critical production pipeline from 80 to 25 minutes",
    problem: "A daily production-data pipeline took 80 minutes, delaying the reports operations teams relied on each morning.",
    built: "Re-engineered the Spark jobs with incremental loads, better partitioning and Delta Lake optimisation.",
    result: "80 min → 25 min",
    tech: ["Databricks", "PySpark", "Delta Lake"],
  },
  {
    client: "Enterprise data team",
    title: "Migrating from Hadoop to Databricks",
    problem: "An on-premises Hadoop estate was slow, costly to run and difficult to scale for new workloads.",
    built: "Planned and delivered a phased migration to the Databricks lakehouse, validating each workload against the original output.",
    result: "30–40% faster jobs",
    tech: ["Databricks", "Spark", "Hadoop"],
  },
  {
    client: "Data platform team",
    title: "A reusable framework for building pipelines",
    problem: "Each new data source needed a hand-built pipeline, so delivery was slow and standards varied between teams.",
    built: "Introduced a metadata-driven ingestion framework with shared templates, testing and deployment automation.",
    result: "50% faster pipeline builds",
    tech: ["Databricks", "Python", "CI/CD"],
  },
];

export const privateAi = {
  kicker: "Private AI",
  title: "Your data, your content, your IP — fully secure and private.",
  body: "We build AI that runs inside your own environment instead of relying on a single off-the-shelf SaaS provider. That reduces vendor lock-in, makes it easier to adopt new models, and helps you build an advantage you own.",
  points: [
    {
      title: "Own your IP",
      body: "Keep control of the AI assets you invest in.",
    },
    {
      title: "Avoid vendor lock-in",
      body: "Stay adaptable with an architecture you can change.",
    },
    {
      title: "Lower running costs",
      body: "Use precise, customised requests so token spend stays low.",
    },
    {
      title: "Model independent",
      body: "From small to large language models, open or proprietary — we choose what fits.",
    },
    {
      title: "High-quality output",
      body: "Grounded in your data and context so responses stay reliable.",
    },
    {
      title: "Enterprise secure",
      body: "Data stays inside your environment and access controls.",
    },
  ],
};

export const steps = [
  {
    number: "01",
    title: "Discovery",
    duration: "1–2 weeks",
    body: "Understand your data, systems and goals, then identify and prioritise the opportunities with the best return.",
  },
  {
    number: "02",
    title: "Scoping & architecture",
    duration: "2–3 weeks",
    body: "Agree the target architecture, risks and success measures, and produce a delivery roadmap.",
  },
  {
    number: "03",
    title: "Proof of concept",
    duration: "3–6 weeks",
    body: "Prove the approach on real data with the simplest version that answers the key question.",
  },
  {
    number: "04",
    title: "Production build",
    duration: "6–12 weeks",
    body: "Harden pipelines, models and integrations, with testing, deployment automation and monitoring.",
  },
  {
    number: "05",
    title: "Run & improve",
    duration: "Ongoing",
    body: "Operate, monitor and extend the solution as your data, users and the technology change.",
  },
];

export const accelerators = {
  status: "In development",
  items: [
    {
      title: "Customer Analytics",
      body: "Starting point for customer segmentation, churn and lifetime-value insight.",
    },
    {
      title: "Answer Generator",
      body: "Ask questions of your manuals, guidelines and regulatory documents.",
    },
    {
      title: "Information Finder",
      body: "Search across business information held in different systems.",
    },
    {
      title: "Report Generator",
      body: "Domain-specific report drafts generated from your business data.",
    },
    {
      title: "AI Agents",
      body: "Agents that take on repetitive, rules-based tasks with human review.",
    },
  ],
};

// Set name to the client's name only with their written permission to publish it.
export const testimonial = {
  quote:
    "Their rigour and determination to use AI and ML to solve problems was second to none.",
  name: "",
  role: "Director, US energy company",
};

export const about = {
  title: "Senior engineers who have built this before.",
  body: "Byte Analytics was founded in 2019 by engineers with more than 15 years of experience, including at Microsoft, building data platforms and machine learning systems for large organisations. The people who scope your project are the people who build it.",
  certifications: ["Databricks certified", "AWS certified"],
  // Add each founder as { name, role, background, photo: "/team/name.jpg" }.
  team: [] as { name: string; role: string; background: string; photo: string }[],
};

// Set price to text such as "From £X / month" when pricing is agreed.
export const packages = [
  {
    name: "Discover",
    summary: "An assessment and roadmap for your data, ML and AI.",
    audience: "Organisations deciding where data and AI can make the biggest difference.",
    deliverables: [
      "Assessment of your data platform and ML maturity",
      "Prioritised use cases with estimated value",
      "Target architecture and 90-day roadmap",
    ],
    team: ["Technical lead", "Data & ML architect"],
    hours: "40h–50h",
    price: "",
    featured: false,
  },
  {
    name: "Accelerate",
    summary: "Build one use case and take it into production.",
    audience: "Organisations with a clear use case that need help delivering it.",
    deliverables: [
      "One use case taken from proof of concept to production",
      "Data pipelines, model, deployment and monitoring",
      "Handover documentation and team training",
    ],
    team: ["Technical project manager", "Data engineer", "ML engineer", "AI specialist"],
    hours: "100h–120h",
    price: "",
    featured: true,
  },
  {
    name: "Pioneer",
    summary: "A data and ML platform with several use cases running on it.",
    audience: "Organisations making data and AI a long-term capability.",
    deliverables: [
      "Lakehouse and MLOps platform foundation",
      "CI/CD, monitoring and governance for models",
      "Several use cases delivered on a rolling roadmap",
    ],
    team: ["Technical project manager", "Solution architect", "Data engineers", "ML engineer", "AI specialist"],
    hours: "220h–260h",
    price: "",
    featured: false,
  },
];

export const packageNames = packages.map((item) => item.name);

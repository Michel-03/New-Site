export const company = {
  name: "Byte Analytics",
  eyebrow: "AI and data consultancy · Since 2019",
  headlineLead: "Empowering businesses",
  headlineAccent: "with AI.",
  summary:
    "Founded in 2019, Byte Analytics specializes in delivering cutting-edge artificial intelligence and data-driven solutions that empower businesses across diverse industries. We help organizations harness AI, automation, and modern data platforms for sustainable growth and transformation.",
  platforms: ["Databricks", "AWS", "Snowflake", "Azure", "UiPath", "MuleSoft"],
};

export const nav = [
  { id: "services", label: "Services" },
  { id: "platform", label: "Platform" },
  { id: "process", label: "Process" },
  { id: "cortex", label: "Cortex" },
  { id: "packages", label: "Packages" },
  { id: "contact", label: "Contact" },
] as const;

export const stats = [
  { value: 2019, from: 2000, suffix: "", label: "Established" },
  { value: 6, from: 0, suffix: "", label: "Practice areas" },
  { value: 5, from: 0, suffix: "", label: "Delivery stages" },
  { value: 24, from: 0, suffix: "h", label: "Response time" },
];

export const services = [
  {
    index: "a",
    title: "Artificial Intelligence",
    body: "Transform your business with AI-driven automation and insights. Our solutions enhance efficiency, reduce costs, and enable smarter decisions through seamless system integration.",
    tags: ["LLM systems", "RAG", "Agents"],
  },
  {
    index: "b",
    title: "Data Science",
    body: "Unlock the power of your data with intelligent analysis and forecasting. We help businesses optimize performance, reduce risk, and grow with confidence.",
    tags: ["Forecasting", "Analytics", "MLOps"],
  },
  {
    index: "c",
    title: "Data Engineering",
    body: "Power your analytics with robust data infrastructure. Our solutions enable faster insights, better data quality, and seamless scalability.",
    tags: ["Pipelines", "Lakehouse", "Streaming"],
  },
  {
    index: "d",
    title: "Lakeflow & Data Warehousing",
    body: "Ingest, transform, and orchestrate with a unified data engineering solution on Databricks.",
    tags: ["Databricks", "Lakeflow", "Snowflake"],
  },
  {
    index: "e",
    title: "Cloud Services",
    body: "Accelerate your digital transformation with reliable cloud infrastructure built for flexibility, security, and growth.",
    tags: ["AWS", "Azure", "GCP"],
  },
  {
    index: "f",
    title: "Automation & Integration",
    body: "Enhance operational efficiency using UiPath-based RPA automation combined with MuleSoft system integration, reducing manual effort while keeping data flowing smoothly across platforms.",
    tags: ["UiPath", "MuleSoft", "RPA"],
  },
];

export const platform = {
  kicker: "Your in-house artificial intelligence platform",
  title: "Your data, your content, your IP — fully secure and private.",
  body: "Agnostic AI lets you keep full control of your AI capabilities instead of relying on a single off-the-shelf SaaS provider. That reduces vendor lock-in, makes it easier to adopt new technology, and helps you build an advantage you actually own.",
  points: [
    {
      title: "Own your IP",
      body: "Maintain control over the AI assets you invest in.",
    },
    {
      title: "Avoid vendor lock",
      body: "Stay adaptable with an architecture you can change.",
    },
    {
      title: "Save more",
      body: "Use precise, customized requests so token spend stays low.",
    },
    {
      title: "Model independent",
      body: "From SLMs to LLMs, open or proprietary — we choose what works best.",
    },
    {
      title: "High-quality output",
      body: "Customized with your data and context so responses stay reliable.",
    },
    {
      title: "Enterprise secure",
      body: "Data stays safeguarded inside your environment.",
    },
  ],
};

export const steps = [
  {
    number: "01",
    title: "AI discovery session",
    body: "Identify opportunities to transform your business with AI, calculate ROI, and prioritise use cases.",
  },
  {
    number: "02",
    title: "AI scoping programme",
    body: "Build a robust AI strategy, predict and mitigate risk factors, and develop a detailed roadmap.",
  },
  {
    number: "03",
    title: "Proof of concept",
    body: "Validate that a solution will work by building the simplest possible version of your product.",
  },
  {
    number: "04",
    title: "Minimum viable product",
    body: "Turn the proof of concept into the simplest usable version that real users can beta-test.",
  },
  {
    number: "05",
    title: "Ongoing maintenance",
    body: "Maintain and enhance your product with continuous updates and the latest AI technology trends.",
  },
];

export const cortex = [
  {
    title: "Customer Analytics",
    body: "Bring your customer experience to the next level.",
  },
  {
    title: "Answer Generator",
    body: "Talk to your manuals, guidelines, and regulatory books.",
  },
  {
    title: "Information Finder",
    body: "Have all your business information at your fingertips.",
  },
  {
    title: "Report Generator",
    body: "Quality, domain-specific content generation based on your business data.",
  },
  {
    title: "AI Agents",
    body: "Outsource manual tasks to agents.",
  },
];

export const testimonial = {
  quote:
    "Their rigour and determination to use AI and ML to solve problems was second to none.",
  name: "Ameet Benegal",
  role: "Director, HSBC Global Commercial Banking",
};

export const packages = [
  {
    name: "Discover",
    summary: "Explore AI opportunities and start developing your first function.",
    audience:
      "A business at the beginning of its journey with AI, ready to explore opportunities.",
    team: [
      "1 Technical PM",
      "1 Strategic Value Consultant",
      "1 PhD-level AI Expert",
      "1 Data/ML Engineer",
    ],
    hours: "40h–50h",
    featured: false,
  },
  {
    name: "Accelerate",
    summary: "Develop and integrate custom AI solutions into your business.",
    audience:
      "A business that has a good idea for how it wants to use AI and needs help with execution.",
    team: [
      "1 Technical PM",
      "1 Strategic Value Consultant",
      "1 PhD-level AI Expert",
      "1 Data/ML Engineer",
    ],
    hours: "100h–120h",
    featured: true,
  },
  {
    name: "Pioneer",
    summary: "Lead your industry with innovative AI applications.",
    audience:
      "A business that wants to be first to market with custom AI solutions and stay ahead of the competition.",
    team: [
      "1 Technical PM",
      "1 Strategic Value Consultant",
      "1 PhD-level AI Expert",
      "1 Data Engineer",
      "1 ML Engineer",
    ],
    hours: "220h–260h",
    featured: false,
  },
];

export const packageNames = packages.map((item) => item.name);

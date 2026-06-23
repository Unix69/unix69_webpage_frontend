
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';

// Mantine Core
import { 
  Modal, Tabs, TextInput, Container, Title, Badge, SimpleGrid, rem, 
  Card, Text, CopyButton, Button, Group, Collapse, Stack, Box, Paper, ThemeIcon, 
  List, Select, ActionIcon, Checkbox, Chip, Affix, Transition, Center, Flex, Grid, Accordion, Divider, Progress, UnstyledButton
} from '@mantine/core';


import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react'; 
import '@xyflow/react/dist/style.css'; 


// Mantine Date & Carousel
import { DateTimePicker } from '@mantine/dates';

// Date-fns
import { startOfWeek, addWeeks, subWeeks, format, isSameDay, addDays, isToday } from 'date-fns';

// Tabler Icons (Unificate)
import { 
  IconChevronUp, IconPhoneCall, IconGavel, IconShieldCheck, IconCurrencyEuro, IconBuildingFactory, IconCar, IconHeartbeat, IconTruck, IconCoin, IconArrowRight, IconPackage, IconUserCheck,
  IconBolt, IconLeaf, IconWorld, IconShoppingBag, IconUsers, 
  IconDeviceTv, IconCpu, IconNetwork, IconCloud, IconShieldLock, 
  IconBrain, IconDatabase, IconDeviceMobile, IconLayoutGrid, 
  IconRocket, IconBuildingFactory2, IconCode, IconKey, IconRefresh, 
  IconGauge, IconSettings, IconBug, IconClipboardList, IconTargetArrow, 
  IconTools, IconRoute, IconCheck, IconClock, IconBriefcase,
  IconFolderOff, IconCopy, IconCopied, IconWallet, IconX, 
  IconSearch, IconDownload, IconFileTypePdf, IconFileTypeMp4, IconFileTypeZip,
  IconCalendarEvent, IconDeviceLaptop, IconFileCode, IconMessageChatbot, 
  IconCalendar, IconBook, IconCalendarCheck, IconDeviceDesktopCode, IconFolder, IconChevronRight, IconChevronDown, IconChevronLeft, IconFileText, 
  IconSchool, IconTarget, IconFileCheck, IconBrandPaypal, IconCreditCard, 
  IconBrandRevolut, IconAlertTriangle, IconBuildingBank, IconHelp, 
  IconTerminal, IconBox, IconBookmark, IconBulb, IconFile, IconLink, 
  IconFileZip, IconBrandApple,IconPlus, IconBrandTelegram, IconAt, IconInfoCircle, IconLicense, IconLock, IconShoppingCart
} from '@tabler/icons-react';


import "./Lessons.css";

/*
=====================================================
LESSONS PAGE
=====================================================

Designed for:

- GitHub Pages
- Static filesystem content
- Dynamic directory tree rendering
- Cal.com integration
- Downloadable lesson materials
- Modern UI

=====================================================
HOW IT WORKS
=====================================================

1. Put lessons inside:

public/lessons/

2. Generate lessons-tree.json automatically

3. React renders everything dynamically

=====================================================
EXAMPLE STRUCTURE
=====================================================

public/
└── lessons/
    ├── Programming/
    │   ├── C++/
    │   │   └── materials/
    │   │       ├── tutorials/
    │   │       ├── guides/
    │   │       ├── scripts/
    │   │       └── projects/
    │   │
    │   └── Python/
    │
    ├── Operating Systems/
    └── Networking/

=====================================================
*/

const CAL_CONSULTING_LINK = "https://cal.com/giuseppe-pedone-28bua5/it-consulting";
const RAILWAY_BACKEND_LINK = "https://unix69webpagebackend-production.up.railway.app";




const ALLOWED_CONSULTING_BOOK_FORM_VALUES = {
  durations: ['30 min', '1 h', '2 h'],
  payment_methods: ['pay-now', 'pay-later'],
  
  business_domains: [
    'Industrial & Automation',
    'Automotive & Aerospace',
    'Healthcare & BioTech',
    'Logistics & Supply Chain',
    'FinTech & Banking',
    'Manufactoring & Smart Factories',
    'Energy & Smart Grid',
    'AgroTech',
    'Environment & Smart Cities',
    'Retail & E-commerce',
    'HR & Management',
    'Media & Entertainment'
  ],
  
  application_domains: [
    'IoT & Embedded Systems',
    'Cyber-Physical Systems',
    'Cloud & Distributed Systems',
    'Cybersecurity & Infrastructure',
    'AI & Data Science',
    'Edge Computing & Real-time Analytics',
    'Mobile and Wearable Systems',
    'Multi & Cross-Platform Systems'
  ],
  
  job_categories: [
    'Prototyping & Proof of Concept',
    'Software Architecture & System Design',
    'Legacy System Migration & Refactoring',
    'Code Audit & Security Hardening',
    'Debugging & Critical Troubleshooting',
    'Production Engineering & Industrialization',
    'Performance & Scalability Optimization',
    'Technical Project Management'
  ]
};

const durations = ALLOWED_CONSULTING_BOOK_FORM_VALUES.durations;
const payment_methods = ALLOWED_CONSULTING_BOOK_FORM_VALUES.payment_methods;
const business_domains = ALLOWED_CONSULTING_BOOK_FORM_VALUES.business_domains;
const application_domains = ALLOWED_CONSULTING_BOOK_FORM_VALUES.application_domains;
const job_categories = ALLOWED_CONSULTING_BOOK_FORM_VALUES.job_categories;


const business_domains_desc_map = {
  [business_domains[0]]: "Automation and control systems for high-efficiency production lines.",
  [business_domains[1]]: "Advanced software solutions for next-gen vehicles and aerial systems.",
  [business_domains[2]]: "Digital transformation for diagnostic tools and biotech research.",
  [business_domains[3]]: "Optimization of supply chain networks and intelligent fleet tracking.",
  [business_domains[4]]: "Secure financial systems, high-frequency trading, and banking infrastructure.",
  [business_domains[5]]: "IIoT implementation and digital twins for smart manufacturing.",
  [business_domains[6]]: "Smart grid management and renewable energy efficiency optimization.",
  [business_domains[7]]: "Precision agriculture software and automated crop monitoring.",
  [business_domains[8]]: "Systems for urban monitoring, sustainability, and green energy management.",
  [business_domains[9]]: "Scalable platforms for omnichannel retail and user experience.",
  [business_domains[10]]: "Enterprise software for team optimization and resource management.",
  [business_domains[11]]: "High-performance streaming, content delivery, and interactive media."
};

const business_domains_icon_map = {
  [business_domains[0]]: <IconBuildingFactory size={24} />,
  [business_domains[1]]: <IconCar size={24} />,
  [business_domains[2]]: <IconHeartbeat size={24} />,
  [business_domains[3]]: <IconTruck size={24} />,
  [business_domains[4]]: <IconCoin size={24} />,
  [business_domains[5]]: <IconBuildingFactory size={24} />,
  [business_domains[6]]: <IconBolt size={24} />,
  [business_domains[7]]: <IconLeaf size={24} />,
  [business_domains[8]]: <IconWorld size={24} />,
  [business_domains[9]]: <IconShoppingBag size={24} />,
  [business_domains[10]]: <IconUsers size={24} />,
  [business_domains[11]]: <IconDeviceTv size={24} />
};


const application_domains_desc_map = {
  [application_domains[0]]: "Low-level optimization and firmware for connected devices.",
  [application_domains[1]]: "Modeling complex systems and real-time interaction control.",
  [application_domains[2]]: "Scalable architectures and microservices orchestration.",
  [application_domains[3]]: "Robust defense against vulnerabilities and system hardening.",
  [application_domains[4]]: "Predictive modeling, data pipelines, and machine learning integration.",
  [application_domains[5]]: "Processing data at the source for immediate decision making.",
  [application_domains[6]]: "Performance-optimized software for portable and wearable hardware.",
  [application_domains[7]]: "Unified codebase strategy across desktop, mobile, and web."
};

const job_categories_desc_map = {
  [job_categories[0]]: "Rapid development of functional prototypes to validate concepts.",
  [job_categories[1]]: "Bridging the gap between software design and hardware production.",
  [job_categories[2]]: "Building modular, maintainable, and high-performance system architectures.",
  [job_categories[3]]: "Rigorous security audits and system defense implementation.",
  [job_categories[4]]: "Modernizing outdated codebases while preserving business logic.",
  [job_categories[5]]: "Deep code profiling and system-wide performance tuning.",
  [job_categories[6]]: "Implementing automated pipelines for continuous delivery.",
  [job_categories[7]]: "High-stakes technical problem solving for mission-critical failures.",
  [job_categories[8]]: "Strategic management of complex engineering lifecycles."
};

const application_domains_icon_map = {
  [application_domains[0]]: <IconCpu size={24} />,
  [application_domains[1]]: <IconNetwork size={24} />,
  [application_domains[2]]: <IconCloud size={24} />,
  [application_domains[3]]: <IconShieldLock size={24} />,
  [application_domains[4]]: <IconBrain size={24} />,
  [application_domains[5]]: <IconDatabase size={24} />,
  [application_domains[6]]: <IconDeviceMobile size={24} />,
  [application_domains[7]]: <IconLayoutGrid size={24} />
};

const job_categories_icon_map = {
  [job_categories[0]]: <IconRocket size={24} />,
  [job_categories[1]]: <IconBuildingFactory2 size={24} />,
  [job_categories[2]]: <IconCode size={24} />,
  [job_categories[3]]: <IconKey size={24} />,
  [job_categories[4]]: <IconRefresh size={24} />,
  [job_categories[5]]: <IconGauge size={24} />,
  [job_categories[6]]: <IconSettings size={24} />,
  [job_categories[7]]: <IconBug size={24} />,
  [job_categories[8]]: <IconClipboardList size={24} />
};






const models = [
  {
    category: "Development Lifecycle (SDLC)",
    items: ["Code & Fix", "Waterfall", "V-Model", "Iterative", "Agile", "DevOps / CI-CD"]
  },
  {
    category: "Testing Models",
    items: ["Manual Testing", "Unit Testing", "Integration Testing", "End-to-End"]
  },
  {
    category: "Packaging Models",
    items: ["Source Distribution", "Package Manager", "Binary Packaging", "Docker Container", "Immutable Images"]
  },
  {
    category: "Deployment Models",
    items: ["Local Deployment", "Client-Based", "Server-Based", "Cloud Deployment", "Microservices"]
  },
  {
    category: "Maintenance Models",
    items: ["Corrective", "Adaptive", "Perfective", "Preventive"]
  },
  {
    category: "Computational Models",
    items: ["Local", "Locale-Server", "Remoto Custom", "Remoto Cloud", "Serverless", "Hybrid"]
  },
  {
    category: "Data Models",
    items: ["RAM", "Disco Locale", "Disco Remoto", "Server Locale", "Server Remoto", "Cloud", "Client"]
  },
  {
    category: "Security Models",
    items: ["Basic Encryption", "Enterprise Encryption", "Zero Trust Data Security", "Confidential Computing", "mTLS", "OAuth2", "Container Security"]
  }
];

export const models_info = [
  {
    category: models[0].category,
    desc: "Methodologies for managing the software development lifecycle.",
    items: [
      { 
        name: models[0].items[0], 
        desc: "Sequential execution of phases; best for rigid, well-defined requirements.", 
        complexity: "Very Low", automation: "None", pros: "Initial speed", cons: "Technical debt" 
      },
      { 
        name: models[0].items[1], 
        desc: "Incremental development through repeating cycles with frequent customer feedback.", 
        complexity: "Low", automation: "Low", pros: "Clear planning", cons: "Rigidity" 
      },
      { 
        name: models[0].items[2], 
        desc: "Strict adherence to process standards and detailed documentation at every stage.", 
        complexity: "Medium", automation: "Medium", pros: "High quality", cons: "Rigid" 
      },
      { 
        name: models[0].items[3], 
        desc: "Focus on empirical process control, transparency, and inspection via sprints.", 
        complexity: "Medium", automation: "Medium", pros: "Continuous feedback", cons: "Complex planning" 
      },
      { 
        name: models[0].items[4], 
        desc: "Flow-based approach focusing on limiting work-in-progress and visual management.", 
        complexity: "High", automation: "High", pros: "Flexibility", cons: "Variable control" 
      },
      { 
        name: models[0].items[5], 
        desc: "Integration of development and operations with automated CI/CD pipelines.", 
        complexity: "Very High", automation: "Very High", pros: "Full automation", cons: "Infra complexity" 
      }
    ]
  },
  {
    category: models[1].category,
    desc: "Strategies for software quality validation.",
    items: [
      { name: models[1].items[0], desc: "Manual checks to ensure the interface meets end-user expectations.", complexity: "Low", automation: "None", pros: "UX flexibility", cons: "Not scalable" },
      { name: models[1].items[1], desc: "Automated verification of smallest code units.", complexity: "Medium", automation: "High", pros: "Early bug detection", cons: "Limited scope" },
      { name: models[1].items[2], desc: "Validating how multiple integrated units function together.", complexity: "Medium-High", automation: "Medium", pros: "Module verification", cons: "Complex" },
      { name: models[1].items[3], desc: "Comprehensive testing covering all possible code execution paths.", complexity: "Very High", automation: "High", pros: "Total coverage", cons: "Slow and fragile" }
    ]
  },
  {
    category: models[2].category,
    desc: "Strategies for bundling and distributing software.",
    items: [
      { name: models[2].items[0], desc: "Direct distribution of source or raw compiled files.", complexity: "Very Low", automation: "N/A", pros: "Simplicity", cons: "No protection" },
      { name: models[2].items[1], desc: "Structured archives with declared dependencies for specific environments.", complexity: "Low", automation: "Medium", pros: "Dependency management", cons: "Version conflicts" },
      { name: models[2].items[2], desc: "Optimized binaries built for specific hardware architectures.", complexity: "Medium", automation: "Medium", pros: "Performance", cons: "Not portable" },
      { name: models[2].items[3], desc: "Isolated environment snapshots ensuring identical execution across hosts.", complexity: "High", automation: "High", pros: "Reproducibility", cons: "DevOps complex" },
      { name: models[2].items[4], desc: "Fully automated immutable image deployment for large scale clusters.", complexity: "Very High", automation: "Very High", pros: "Scalability", cons: "Complex infra" }
    ]
  },
  {
    category: models[3].category,
    desc: "Architecture and distribution patterns.",
    items: [
      { name: models[3].items[0], desc: "A unified codebase where all components are tightly coupled.", complexity: "Low", scalability: "Low", pros: "Simple", cons: "Not scalable" },
      { name: models[3].items[1], desc: "Decoupled services communicating over network protocols.", complexity: "Medium", scalability: "Media", pros: "Wide reach", cons: "Complex management" },
      { name: models[3].items[2], desc: "Function-as-a-service logic triggered by specific events.", complexity: "Medium", scalability: "Media", pros: "Centralized control", cons: "Single point failure" },
      { name: models[3].items[3], desc: "Architecture designed to expand automatically based on demand.", complexity: "High", scalability: "High", pros: "Auto-scaling", cons: "Vendor lock-in" },
      { name: models[3].items[4], desc: "Self-healing, distributed architecture ensuring 99.999% uptime.", complexity: "Very High", scalability: "Very High", pros: "Resilience", cons: "High complexity" }
    ]
  },
  {
    category: models[4].category,
    desc: "Approaches to long-term system evolution.",
    items: [
      { name: models[4].items[0], desc: "Immediate patch applied to solve a critical production issue.", complexity: "Low", impact: "Bug fix", pros: "Simple", cons: "Non-evolutionary" },
      { name: models[4].items[1], desc: "Adapting existing code to run on new platform versions.", complexity: "Medium", impact: "Compatibility", pros: "Flexible", cons: "Expensive" },
      { name: models[4].items[2], desc: "Incremental feature enhancement to meet rising user demands.", complexity: "High", impact: "Improvements", pros: "Quality gain", cons: "Increased complexity" },
      { name: models[4].items[3], desc: "Refactoring and cleaning codebase to increase long-term velocity.", complexity: "High", impact: "Optimization", pros: "Reduces debt", cons: "Slow ROI" }
    ]
  },
  {
    category: models[5].category,
    desc: "Models based on computation locality and execution targets.",
    items: [
      { name: models[5].items[0], desc: "Software running directly on the user's operating system.", subTypes: "CLI, GUI", cost: "Low", deployment: "Manual/Local" },
      { name: models[5].items[1], desc: "Services interacting within a private local network.", subTypes: "Micro-Service LAN", cost: "Medium", deployment: "Master Setup" },
      { name: models[5].items[2], desc: "Direct hardware execution without hypervisor layers.", subTypes: "Bare-Metal", cost: "High", deployment: "Server Setup" },
      { name: models[5].items[3], desc: "Virtualized resources managed via cloud orchestration tools.", subTypes: "IaaS, Container", cost: "High (OpEx)", deployment: "Orchestration" },
      { name: models[5].items[4], desc: "Stateless compute triggered by cloud platform events.", subTypes: "FaaS", cost: "Variable", deployment: "Cloud Trigger" },
      { name: models[5].items[5], desc: "Computation logic divided between edge and central cloud.", subTypes: "Split-Logic", cost: "Very High", deployment: "OTA / Pipeline" }
    ]
  },
  {
    category: models[6].category,
    desc: "Data residency, persistence, and performance characteristics.",
    items: [
      { name: models[6].items[0], desc: "Transient data held in fast, volatile memory buffers.", speed: "Max", persistence: "No", scalability: "Limited" },
      { name: models[6].items[1], desc: "Standard flat files stored on local system storage.", speed: "High", persistence: "Yes", scalability: "Low" },
      { name: models[6].items[2], desc: "Relational tables for structured, ACID-compliant data storage.", speed: "Medium", persistence: "Yes", scalability: "Medium" },
      { name: models[6].items[3], desc: "Key-value stores optimized for sub-millisecond retrieval.", speed: "High", persistence: "Yes", scalability: "Medium" },
      { name: models[6].items[4], desc: "Distributed document store for flexible, schema-less data.", speed: "Medium", persistence: "Yes", scalability: "High" },
      { name: models[6].items[5], desc: "Infinite horizontal storage managed via cloud-native API.", speed: "Variable", persistence: "Yes", scalability: "Unlimited" },
      { name: models[6].items[6], desc: "Graph structure optimized for complex relationship querying.", speed: "High", persistence: "Variable", scalability: "High" }
    ]
  },
  {
    category: models[7].category,
    desc: "Data protection, transit, access, and runtime security.",
    items: [
      { name: models[7].items[0], desc: "Basic perimeter defense for standard web traffic.", securityLevel: "Medium", cost: "Low", complexity: "Low" },
      { name: models[7].items[1], desc: "End-to-end encryption for sensitive data communications.", securityLevel: "High", cost: "Medium", complexity: "Medium" },
      { name: models[7].items[2], desc: "Advanced protection for critical assets and key management.", securityLevel: "Very High", cost: "High", complexity: "High" },
      { name: "Confidential Computing", desc: "Hardware-enforced isolation for data currently in use.", securityLevel: "Extreme", cost: "Very High", complexity: "Very High" },
      { name: models[7].items[4], desc: "Network-level security to prevent unauthorized horizontal moves.", context: "Transit", pros: "Prevents lateral movement", complexity: "High" },
      { name: models[7].items[5], desc: "Verification layer for external system integrations.", context: "Access", pros: "Public API security", complexity: "Medium" },
      { name: models[7].items[6], desc: "Sandboxing processes to prevent system-wide compromises.", context: "Runtime", pros: "Isolation", complexity: "High" }
    ]
  }
];


export const price_per_slot = [30, 50, 90]

export const slots_info = {
  halfHour: { duration: durations[0], price: price_per_slot[0], label: "30 min Consulting" },
  oneHour: { duration: durations[1], price: price_per_slot[1], label: "1h Consulting" },
  twoHours: { duration: durations[2], price: price_per_slot[2], label: "2h Consulting" }
};

// Global policy for all services (meetings and extra work)
export const payment_info = {
  depositRequired: true,
  paymentMethods: payment_methods,
  depositPercentage: 0.20, // 20% upfront
  note: [
    "First 30 minutes of consulting are free",
    "A 20% deposit is required for all consulting, analysis, and development services.",
    "Cancellation: 2 biz days notice",
    "Refunds: Never"
  ]
};

export const buisness_service_info = {
  Analysis: {
    hourlyRate: 25,
    description: "Feasibility studies, requirement gathering, and current-state audits.",
    deliverables: {
      srs: "SRS (Software Requirements Specification)",
      auditReport: "Audit Report",
      feasibilityStudy: "Feasibility Study",
      infrastructureAssessment: "Infrastructural & Operational Assessment Report" // Aggiornato
    }
  },
  Design: {
    hourlyRate: 40,
    description: "System architecture, domain modeling, and data flow planning.",
    deliverables: {
      sad: "SAD (Software Architecture Document)",
      erDiagram: "ER Diagram",
      apiSpecification: "API Specification",
      finopsBudget: "FinOps Cost Architecture & Budget Plan", // Aggiornato
      patchRoadmap: "Security Patch Roadmap" // Aggiornato
    }
  },
  Prototyping: {
    hourlyRate: 30,
    description: "Development of high-fidelity MVPs and technological PoCs.",
    deliverables: {
      uiuxMockups: "UI/UX Mockups (Figma)",
      architecturalSpikes: "Architectural Spikes",
      functionalPoc: "Functional PoC"
    }
  },
  Development: {
    hourlyRate: 40,
    description: "Full-stack implementation, AI logic, and third-party integration.",
    deliverables: {
      sourceCode: "Source Code (Git)",
      databaseSchema: "Database Schema",
      documentation: "Documentation"
    }
  },
  Integration: {
    hourlyRate: 45,
    description: "Connecting modules, internal systems, and external SDKs/APIs.",
    deliverables: {
      integrationReport: "Integration Report",
      apiConnectionLogs: "API Connection Logs",
      middlewareDocumentation: "Middleware Documentation"
    }
  },
  Testing: {
    hourlyRate: 35,
    description: "Rigorous bug hunting and code coverage analysis.",
    deliverables: {
      testPlan: "Test Plan",
      bugTrackingReport: "Bug Tracking Report",
      codeCoverageAnalysis: "Code Coverage Analysis"
    }
  },
  Validation: {
    hourlyRate: 40,
    description: "User Acceptance Testing (UAT) and business requirement alignment.",
    deliverables: {
      uatSignOff: "UAT Sign-off Document",
      validationChecklist: "Validation Checklist"
    }
  },
  Packaging: {
    hourlyRate: 40,
    description: "Software bundling and distribution preparation.",
    deliverables: {
      buildArtifacts: "Build Artifacts",
      installationGuides: "Installation Guides",
      versionReleaseNotes: "Version Release Notes"
    }
  },
  Deployment: {
    hourlyRate: 50,
    description: "Production release, infrastructure setup, and go-live support.",
    deliverables: {
      deploymentPlan: "Deployment Plan",
      environmentSetupGuide: "Environment Setup Guide",
      goLiveReport: "Go-Live Report"
    }
  },
  EngineeringMaintenance: {
    hourlyRate: 50,
    description: "Industrialization, CI/CD, and ongoing system health monitoring.",
    deliverables: {
      cicdPipelineScripts: "CI/CD Pipeline Scripts",
      monitoringDashboards: "Monitoring Dashboards",
      maintenanceLogs: "Maintenance Logs"
    }
  },
  Security: {
    hourlyRate: 50,
    description: "Security hardening, Zero Trust implementation, and compliance.",
    deliverables: {
      vulnerabilityAssessmentReport: "Vulnerability Assessment Report",
      compliancePolicy: "Compliance Policy",
      remediationPlan: "Remediation & Mitigation Plan" // Aggiornato
    }
  },
  Training: {
    hourlyRate: 50,
    description: "Technical handover and staff training.",
    deliverables: {
      handoverDoc: "Handover Doc",
      trainingSessionMaterials: "Training Session Materials"
    }
  }
};



const buisness_domains_info = {
  title: "Business Domains",
  intro: "We bridge the gap between complex engineering and core business value.",
  outro: "Strategic alignment is the first step to successful scaling.",
  iconDefault: <IconTargetArrow size={24} />,
  // Creiamo l'array di oggetti direttamente qui
  items: business_domains.map(domain => ({
    name: domain,
    icon: business_domains_icon_map[domain] || <IconTargetArrow size={24} />,
    desc: business_domains_desc_map[domain] || "Strategic engineering solutions."
  }))
};

const application_domains_info = {
  title: "Application Domains",
  intro: "Targeted expertise across diverse technical landscapes and deployment environments.",
  outro: "Tailored architectural patterns to solve specific domain challenges.",
  iconDefault: <IconCpu size={24} />,
  items: application_domains.map(domain => ({
    name: domain,
    icon: application_domains_icon_map[domain] || <IconCpu size={24} />,
    desc: application_domains_desc_map[domain] || "Technical infrastructure solutions."
  }))
};

// --- Job Categories Info ---
const job_categories_info = {
  title: "Job Categories",
  intro: "Specialized roles designed to accelerate your engineering goals.",
  outro: "Empowering your team with high-impact technical expertise.",
  iconDefault: <IconTools size={24} />,
  items: job_categories.map(category => ({
    name: category,
    icon: job_categories_icon_map[category] || <IconTools size={24} />,
    desc: job_categories_desc_map[category] || "Professional engineering services."
  }))
};


export const consulting_flows_info = [
  {
    job_category: job_categories[0],
    recommended_models: ["Agile", "Manual Testing", "Docker Container", "Cloud Deployment", "Local"],
    phases: [
      {
        id: "START_CONTEXT",
        type: "Initial Setup",
        service_category: "Analysis",
        description: "The customer defines the Job Description, selects the reference Business Domain and Application Domain.",
        purpose: "Frame the business context and primary technological constraints.",
        deliverables: [],
        customer_choices: ["business_domain", "application_domain"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "FREE_CALL",
        type: "Discovery Call",
        service_category: "Prototyping",
        description: "A 30-minute call focused on defining the prototype boundaries and success criteria.",
        purpose: "Synchronize expectations and agree on the minimum validation goal for the MVP.",
        deliverables: [buisness_service_info.Prototyping.deliverables.functionalPoc],
        customer_choices: ["duration", "payment_method"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "ANALYSIS_PHASE",
        type: "Minimum Functional Analysis",
        service_category: "Analysis",
        description: "Extraction of user requirements and identification of indispensable (Must-Have) features only.",
        purpose: "Lock down the prototype scope to avoid feature creep and ensure rapid execution times.",
        deliverables: [
          buisness_service_info.Analysis.deliverables.srs,
          buisness_service_info.Prototyping.deliverables.uiuxMockups
        ],
        customer_choices: ["In-Depth Analysis", "Fast Quote (Worst-case estimate, lower cost)"],
        requires_approval: true,
        loop_on_rejection: "Review of requirements through an in-depth interview",
        is_paid: true
      },
      {
        id: "GANTT_PLANNING",
        type: "Activity Planning",
        service_category: "Prototyping",
        description: "Creation of the schedule for production activities structured over short sprints (1-2 weeks).",
        purpose: "Set dates for live Demos and define task progress status (ongoing, completed, future).",
        deliverables: [buisness_service_info.Prototyping.deliverables.architecturalSpikes],
        customer_choices: ["Timeline Approval"],
        requires_approval: true,
        loop_on_rejection: "Modification of task priorities or the technical stack",
        is_paid: false
      },
      {
        id: "PRODUCTION_EXECUTION",
        type: "Development & Execution",
        service_category: "Development",
        description: "Writing the MVP source code, rapid manual testing, packaging into isolated containers, and deployment to a Sandbox environment.",
        purpose: "Produce a working software artifact ready to be tested by the customer.",
        deliverables: [
          buisness_service_info.Development.deliverables.sourceCode,
          buisness_service_info.Packaging.deliverables.buildArtifacts
        ],
        customer_choices: ["Selection of Optional Technical Models"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "VALIDATION_DEMO",
        type: "Demo & Delivery",
        service_category: "Validation",
        description: "Live presentation in the Sandbox environment and on-the-field prototype validation to verify success criteria.",
        purpose: "Release the code and determine technological feasibility for eventual future industrial development.",
        deliverables: [
          buisness_service_info.Analysis.deliverables.feasibilityStudy,
          buisness_service_info.Validation.deliverables.uatSignOff
        ],
        customer_choices: ["Product Acceptance"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "POST_PRODUCTION",
        type: "Post-Production & Closure",
        service_category: "Packaging",
        description: "Commercial proposal for the evolution of the prototype toward a robust architecture.",
        purpose: "Provide the customer with options to capitalize on the PoC.",
        deliverables: [buisness_service_info.Packaging.deliverables.versionReleaseNotes],
        customer_choices: ["Entrusting extraordinary changes or evolution into production software"],
        requires_approval: false,
        is_paid: false
      }
    ]
  },
  {
    job_category: job_categories[1],
    recommended_models: ["Iterative", "Integration Testing", "Microservices", "Remoto Cloud", "Cloud", "mTLS", "OAuth2"],
    phases: [
      {
        id: "START_CONTEXT",
        type: "Initial Setup",
        service_category: "Analysis",
        description: "The customer defines the Job Description focusing on Non-Functional Requirements (SLAs, Peak Load, Data Volumes).",
        purpose: "Map the corporate ecosystem and infrastructure constraints.",
        deliverables: [],
        customer_choices: ["business_domain", "application_domain"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "FREE_CALL",
        type: "Discovery Call",
        service_category: "Design",
        description: "Strategic alignment focused on expected logical bottlenecks and security compliance standards to meet.",
        purpose: "Outline the macro-components of the architecture.",
        deliverables: [],
        customer_choices: ["duration", "payment_method"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "ANALYSIS_DESIGN_DRAFT",
        type: "System Constraints Analysis",
        service_category: "Analysis",
        description: "Study of interactions between hardware/software components and drafting the initial System Design.",
        purpose: "Define the logical topology of the software (e.g., Microservices or Modular Monolith).",
        deliverables: [
          buisness_service_info.Analysis.deliverables.srs,
          buisness_service_info.Design.deliverables.erDiagram
        ],
        customer_choices: ["In-Depth Analysis", "Fast Quote"],
        requires_approval: true,
        loop_on_rejection: "Redesign of data integration flows",
        is_paid: true
      },
      {
        id: "ARCHITECTURAL_CHOICE",
        type: "Pattern Choice & Cloud Costs",
        service_category: "Design",
        description: "Presentation of software decomposition options and analytical simulation of monthly live network infrastructure expenses (FinOps).",
        purpose: "Guide the customer in choosing the optimal technological solution based on the cost/benefit balance.",
        deliverables: [buisness_service_info.Analysis.deliverables.feasibilityStudy],
        customer_choices: ["Selection of proposed solutions (If undecided: FREE Selection Guidance Call)"],
        requires_approval: true,
        loop_on_rejection: "Modification of architectural patterns to reduce fixed costs (e.g., from Cluster to Serverless)",
        is_paid: false
      },
      {
        id: "GANTT_PLANNING",
        type: "Design Planning",
        service_category: "Design",
        description: "Scheduling of deadlines for the drafting of detailed architectural diagrams and interfaces.",
        purpose: "Coordinate the releases of technical documentation.",
        deliverables: [],
        customer_choices: ["Schedule Approval"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "PRODUCTION_DESIGN",
        type: "Data and API Modeling (Execution)",
        service_category: "Design",
        description: "Drafting of rigorous technical specifications: API interface contracts, database schemas, and authentication flows.",
        purpose: "Produce development blueprints free of engineering ambiguities.",
        deliverables: [
          buisness_service_info.Design.deliverables.sad,
          buisness_service_info.Design.deliverables.apiSpecification,
          buisness_service_info.Development.deliverables.databaseSchema
        ],
        customer_choices: ["Integration of Security and Computation Models"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "VALIDATION_WALKTHROUGH",
        type: "Delivery & Walkthrough",
        service_category: "Validation",
        description: "Interactive analysis session of the architectural package with the customer's management or programmers.",
        purpose: "Obtain final technical sign-off on the produced engineering specifications.",
        deliverables: [buisness_service_info.Validation.deliverables.validationChecklist],
        customer_choices: ["Architecture Acceptance"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "POST_PRODUCTION",
        type: "Architectural Governance",
        service_category: "Training",
        description: "Commercial proposal for the activation of an ongoing hourly Architectural Governance service.",
        purpose: "Periodically verify that the customer's programmers write code in compliance with the SAD.",
        deliverables: [buisness_service_info.Training.deliverables.handoverDoc],
        customer_choices: ["Subscription to code alignment monitoring package"],
        requires_approval: false,
        is_paid: false
      }
    ]
  },
  {
    job_category: job_categories[2],
    recommended_models: ["V-Model", "Unit Testing", "Immutable Images", "Server-Based", "Preventive", "Remoto Custom", "Cloud", "Zero Trust Data Security", "Container Security"],
    phases: [
      {
        id: "START_CONTEXT",
        type: "Initial Setup",
        service_category: "Analysis",
        description: "Provision of secure access to the corporate servers and repositories to be inspected.",
        purpose: "Isolate credentials and map the infrastructure perimeter.",
        deliverables: [],
        customer_choices: ["business_domain", "application_domain"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "FREE_CALL",
        type: "Discovery Call",
        service_category: "Security",
        description: "Definition of the audit scope (e.g., GDPR regulatory compliance, recovery after a cyber attack, OWASP certifications).",
        purpose: "Set security targets and critical data protection areas.",
        deliverables: [],
        customer_choices: ["duration", "payment_method"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "SECURITY_AUDIT_ANALYSIS",
        type: "Investigative Analysis: Vulnerability Assessment",
        service_category: "Security",
        description: "Automated static/dynamic scans (SAST/DAST) and manual inspection of logical attack vectors on the source code.",
        purpose: "Identify and catalog all security flaws present in the application.",
        deliverables: [
          buisness_service_info.Security.deliverables.vulnerabilityAssessmentReport,
          buisness_service_info.Analysis.deliverables.auditReport
        ],
        customer_choices: ["In-Depth Security Analysis", "Fast Quote for high-level maximum hardening"],
        requires_approval: true,
        loop_on_rejection: "Recalibration of scanning parameters or corporate exclusions",
        is_paid: true
      },
      {
        id: "REMEDIATION_PLANNING",
        type: "Remediation Plan & Cost Estimation",
        service_category: "Security",
        description: "Presentation of the intervention plan ordered by severity (Critical, High, Medium, Low) with an estimate of development time and costs.",
        purpose: "Allow the customer to decide which flaws to remediate immediately and which to accept as a calculated risk.",
        deliverables: [buisness_service_info.Security.deliverables.compliancePolicy],
        customer_choices: ["Subscription to patches or signing the Accepted Risk form for excluded flaws"],
        requires_approval: true,
        loop_on_rejection: "Modification of the remediation plan to limit the impact on operational code",
        is_paid: false
      },
      {
        id: "GANTT_PLANNING",
        type: "Patch Task Scheduling",
        service_category: "Design",
        description: "Creation of the Gantt chart for code rewriting and system configuration activities without blocking ordinary operations.",
        purpose: "Coordinate the releases of security fixes in test environments.",
        deliverables: [],
        customer_choices: ["Security Gantt Approval"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "PRODUCTION_HARDENING",
        type: "Hardening Execution",
        service_category: "Development",
        description: "Rewriting vulnerable code, removing hardcoded secrets, encrypting data in transit/at rest, and process sandboxing.",
        purpose: "Resolve vulnerabilities by implementing a Zero Trust defense on the software.",
        deliverables: [
          buisness_service_info.Development.deliverables.sourceCode,
          buisness_service_info.Integration.deliverables.middlewareDocumentation
        ],
        customer_choices: ["Integration of Security and Encryption Models"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "VERIFICATION_TESTING",
        type: "Verification Scan & Validation",
        service_category: "Testing",
        description: "Rerunning vulnerability scans to certify the resilience of defenses and the absence of regression bugs.",
        purpose: "Release the remediated code accompanied by a formal compliance report.",
        deliverables: [
          buisness_service_info.Testing.deliverables.testPlan,
          buisness_service_info.Validation.deliverables.validationChecklist
        ],
        customer_choices: ["Final Security Report Acceptance"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "POST_PRODUCTION",
        type: "Preventive Security Maintenance",
        service_category: "Engineering & Maintenance",
        description: "Proposal for a periodic monitoring service for emerging cyber threats (newly discovered CVEs).",
        purpose: "Keep the application secure over time.",
        deliverables: [buisness_service_info.EngineeringMaintenance.deliverables.maintenanceLogs],
        customer_choices: ["Delegation of security administration (First 3 tickets free)"],
        requires_approval: false,
        is_paid: false
      }
    ]
  },
  {
    job_category: job_categories[3],
    recommended_models: ["Code & Fix", "Manual Testing", "Binary Packaging", "Local Deployment", "Corrective", "Local", "RAM", "Basic Encryption"],
    phases: [
      {
        id: "START_CONTEXT",
        type: "Initial Setup",
        service_category: "Analysis",
        description: "Immediate provision of log files, memory dumps, and configurations of the servers affected by the critical anomaly.",
        purpose: "Collect evidence of the service disruption in the shortest time possible.",
        deliverables: [],
        customer_choices: ["business_domain", "application_domain"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "FREE_CALL",
        type: "Emergency Triage (30 min - FREE)",
        service_category: "Testing",
        description: "Call to understand bug reproducibility, symptoms encountered, and evaluate the economic impact on corporate business.",
        purpose: "Identify the initial root cause and define intervention boundaries.",
        deliverables: [],
        customer_choices: ["duration", "payment_method"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "CRITICAL_INVESTIGATION",
        type: "Investigative Analysis Under Stress",
        service_category: "Testing",
        description: "Real-time tracking of the logical failure within the source code in an isolated environment.",
        purpose: "Pinpoint the exact origin of the malfunction (Root Cause).",
        deliverables: [buisness_service_info.Testing.deliverables.bugTrackingReport],
        customer_choices: ["Urgent Fast Quote (Recommended for production blocks)", "Hourly Detailed Investigative Analysis"],
        requires_approval: true,
        loop_on_rejection: "Authorization to insert extra tracking logs on the customer's active servers",
        is_paid: true
      },
      {
        id: "WORKAROUND_DECISION",
        type: "Recovery Strategy Choice",
        service_category: "Integration",
        description: "Presentation of the Root Cause Analysis and proposal of an immediate workaround (temporary solution) or a definitive fix.",
        purpose: "Allow the customer to decide whether to bring the business back online immediately, postponing optimal code correction.",
        deliverables: [buisness_service_info.Integration.deliverables.apiConnectionLogs],
        customer_choices: ["Choice between Rapid Workaround or Definitive Solution Development"],
        requires_approval: true,
        loop_on_rejection: "Modification of the corrective approach to avoid impacts on third-party software modules",
        is_paid: false
      },
      {
        id: "EMERGENCY_SCHEDULING",
        type: "Hourly Activity Scheduling",
        service_category: "Design",
        description: "Hourly planning for the application of corrective code and minimum stability checks.",
        purpose: "Coordinate the emergency release.",
        deliverables: [],
        customer_choices: ["Recovery Plan Approval"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "HOTFIX_EXECUTION",
        type: "Hotfix Application",
        service_category: "Development",
        description: "Writing targeted corrective code, executing localized unit tests on the failing function, and immediate repackaging.",
        purpose: "Remediate the blocking error, restoring the expected logic.",
        deliverables: [
          buisness_service_info.Development.deliverables.sourceCode,
          buisness_service_info.Packaging.deliverables.buildArtifacts
        ],
        customer_choices: [],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "STABILITY_VALIDATION",
        type: "Validation & Incident Closure",
        service_category: "Validation",
        description: "Deployment of the corrective patch to production and monitoring of error metrics to ensure stability.",
        purpose: "Certify successful service restoration and the closure of the crisis state.",
        deliverables: [
          buisness_service_info.Validation.deliverables.uatSignOff,
          buisness_service_info.Validation.deliverables.validationChecklist
        ],
        customer_choices: ["Incident Closure Acceptance Sign-off"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "POST_PRODUCTION",
        type: "SLA Agreement Activation",
        service_category: "Engineering & Maintenance",
        description: "Commercial proposal for technical availability contracts with binding SLAs (Service Level Agreements) for future interventions.",
        purpose: "Guarantee the customer a manned emergency channel.",
        deliverables: [buisness_service_info.EngineeringMaintenance.deliverables.maintenanceLogs],
        customer_choices: ["Subscription to corrective maintenance package (First 3 inspection tickets free)"],
        requires_approval: false,
        is_paid: false
      }
    ]
  },
  {
    job_category: job_categories[4],
    recommended_models: ["DevOps / CI-CD", "Integration Testing", "Docker Container", "Cloud Deployment", "Perfective", "Remoto Cloud", "Cloud", "Container Security"],
    phases: [
      {
        id: "START_CONTEXT",
        type: "Initial Setup",
        service_category: "Analysis",
        description: "Inspection of current compilation, packaging, and manual deployment methods implemented by the customer's developers.",
        purpose: "Identify operational inefficiencies and human error risks during release.",
        deliverables: [],
        customer_choices: ["business_domain", "application_domain"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "FREE_CALL",
        type: "Discovery Call",
        service_category: "Engineering & Maintenance",
        description: "Definition of automation goals (e.g., desired release frequency, infrastructure self-healing strategies).",
        purpose: "Synchronize operational and infrastructural targets (DevOps).",
        deliverables: [],
        customer_choices: ["duration", "payment_method"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "INDUSTRIALIZATION_AUDIT",
        type: "Context Investigative Analysis",
        service_category: "Analysis",
        description: "Comprehensive audit of the software architecture from a Cloud-Native perspective to assess the containerization status of dependencies.",
        purpose: "Map infrastructural requirements and issue an accurate estimation of industrialization time and costs.",
        deliverables: [
          buisness_service_info.Analysis.deliverables.infrastructureAssessment,
          buisness_service_info.Analysis.deliverables.auditReport
        ],
        customer_choices: ["In-Depth Engineering Analysis", "Standard Fast Quote"],
        requires_approval: true,
        loop_on_rejection: "In-depth interview to redefine network constraints or usable cloud providers",
        is_paid: true
      },
      {
        id: "PIPELINE_FINOPS_DESIGN",
        type: "Pipeline Design & Cloud Budget",
        service_category: "Design",
        description: "Design of automated CI/CD flows and analytical simulation of live server resource expenses (FinOps).",
        purpose: "Ensure optimization of infrastructure costs prior to server provisioning.",
        deliverables: [
          buisness_service_info.EngineeringMaintenance.deliverables.cicdPipelineScripts,
          buisness_service_info.Design.deliverables.sad
        ],
        customer_choices: ["Acceptance of simulated Cloud expenditure plan"],
        requires_approval: true,
        loop_on_rejection: "Recalibration of resources (e.g., from dedicated machines to serverless) to fit the budget",
        is_paid: false
      },
      {
        id: "GANTT_PLANNING",
        type: "DevOps Task Scheduling",
        service_category: "Engineering & Maintenance",
        description: "Creation of the Gantt chart for sequential setup of Test, Staging, and Production environments, with relative Demos and status reports.",
        purpose: "Plan system transition without service disruptions.",
        deliverables: [],
        customer_choices: ["Infrastructural Works Gantt Approval"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "PRODUCTION_AUTOMATION",
        type: "Execution & IaC Writing",
        service_category: "Engineering & Maintenance",
        description: "Writing infrastructure management code (Terraform/Ansible), creating Dockerfiles, and configuring automated pipelines.",
        purpose: "Completely automate the software testing, packaging, and deployment cycle.",
        deliverables: [
          buisness_service_info.EngineeringMaintenance.deliverables.cicdPipelineScripts,
          buisness_service_info.Packaging.deliverables.buildArtifacts,
          buisness_service_info.Integration.deliverables.middlewareDocumentation
        ],
        customer_choices: ["Integration of Deployment and Packaging Models"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "AUTOMATION_VALIDATION",
        type: "Pipeline Load Testing & Validation",
        service_category: "Validation",
        description: "Execution of a fully automated pilot release with stress-testing of auto-scaling and rollback mechanisms.",
        purpose: "Certify complete reliability and fault tolerance of the implemented automated systems.",
        deliverables: [
          buisness_service_info.Validation.deliverables.uatSignOff,
          buisness_service_info.Validation.deliverables.validationChecklist
        ],
        customer_choices: ["Industrialization Acceptance Sign-off"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "POST_PRODUCTION",
        type: "Systems Administration (SRE)",
        service_category: "Engineering & Maintenance",
        description: "Proposal for outsourcing server monitoring tasks, system patching, and continuous administration (Site Reliability Engineering).",
        purpose: "Oversee and guarantee availability (uptime) of the created infrastructure.",
        deliverables: [
          buisness_service_info.EngineeringMaintenance.deliverables.monitoringDashboards,
          buisness_service_info.EngineeringMaintenance.deliverables.maintenanceLogs
        ],
        customer_choices: ["Delegation of server administration and maintenance (First 3 tickets free)"],
        requires_approval: false,
        is_paid: false
      }
    ]
  },
  {
    job_category: job_categories[5],
    recommended_models: ["Iterative", "Unit Testing", "Package Manager", "Server-Based", "Perfective", "Remoto Cloud", "RAM", "Basic Encryption"],
    phases: [
      {
        id: "START_CONTEXT",
        type: "Initial Setup",
        service_category: "Testing",
        description: "Configuration and pairing of performance tracking tools (APM) on an exact copy of the customer's system.",
        purpose: "Obtain an isolated environment suitable for conducting stress-tests without impacting real users.",
        deliverables: [],
        customer_choices: ["business_domain", "application_domain"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "FREE_CALL",
        type: "Discovery Call",
        service_category: "Analysis",
        description: "Identification of critical performance symptoms (e.g., abnormal CPU spikes, slow SQL queries, concurrency locks).",
        purpose: "Establish quantifiable target performance KPIs (e.g., response time under 200 milliseconds).",
        deliverables: [],
        customer_choices: ["duration", "payment_method"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "PROFILING_ANALYSIS",
        type: "Investigative Analysis: Profiling",
        service_category: "Testing",
        description: "Execution of load simulations and examination of I/O resource consumption to track down the exact origin of slowdowns.",
        purpose: "Issue a performance audit and formulate an analytical estimate of costs and times for corrective interventions.",
        deliverables: [
          buisness_service_info.Testing.deliverables.performanceAuditReport,
          buisness_service_info.Analysis.deliverables.auditReport
        ],
        customer_choices: ["In-Depth Profiling Analysis", "Fast Quote for macro optimization"],
        requires_approval: true,
        loop_on_rejection: "In-depth interview focused on unmodifiable third-party services or APIs",
        is_paid: true
      },
      {
        id: "OPTIMIZATION_PLANNING",
        type: "Intervention Matrix",
        service_category: "Design",
        description: "Analytical presentation of necessary changes: introducing caching logic (RAM), rewriting indexes, or refactoring slow algorithms.",
        purpose: "Allow the customer to evaluate the cost/benefit index of individual proposed optimizations.",
        deliverables: [
          buisness_service_info.Analysis.deliverables.feasibilityStudy,
          buisness_service_info.Design.deliverables.erDiagram
        ],
        customer_choices: ["Choice of optimization interventions to approve based on the interview"],
        requires_approval: true,
        loop_on_rejection: "Modification of the approach to prefer less invasive solutions on pre-existing code",
        is_paid: false
      },
      {
        id: "GANTT_PLANNING",
        type: "Refactoring Task Scheduling",
        service_category: "Design",
        description: "Creation of the executive Gantt chart for applying changes, starting from bottlenecks with blocking impacts.",
        purpose: "Organize intermediate performance Demo sessions.",
        deliverables: [],
        customer_choices: ["Optimizations Gantt Approval"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "PRODUCTION_REFACTORING",
        type: "Optimization Execution",
        service_category: "Development",
        description: "Modifying inefficient algorithms, optimizing database queries, and configuring volatile caching layers.",
        purpose: "Increase overall application throughput while reducing latency.",
        deliverables: [
          buisness_service_info.Development.deliverables.sourceCode,
          buisness_service_info.Development.deliverables.databaseSchema,
          buisness_service_info.Testing.deliverables.codeCoverageAnalysis
        ],
        customer_choices: ["Integration of Computational and Data Management Models"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "BENCHMARK_VALIDATION",
        type: "Validation Stress Test",
        service_category: "Validation",
        description: "Final simulation of massive traffic spikes to empirically measure the reduction in response times.",
        purpose: "Certify achievement of performance KPIs agreed upon at the beginning with the customer.",
        deliverables: [
          buisness_service_info.Validation.deliverables.benchmarkScalingReport,
          buisness_service_info.Validation.deliverables.uatSignOff
        ],
        customer_choices: ["Optimization Acceptance Sign-off"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "POST_PRODUCTION",
        type: "Preventive Performance Maintenance",
        service_category: "Engineering & Maintenance",
        description: "Commercial proposal for cyclic health monitoring of the application to prevent performance degradation due to data growth.",
        purpose: "Keep the software snappy and scalable in the long term.",
        deliverables: [
          buisness_service_info.EngineeringMaintenance.deliverables.monitoringDashboards,
          buisness_service_info.EngineeringMaintenance.deliverables.maintenanceLogs
        ],
        customer_choices: ["Entrusting post-production and periodic calibration (First 3 tickets free)"],
        requires_approval: false,
        is_paid: false
      }
    ]
  },
  {
    job_category: job_categories[6],
    recommended_models: ["Waterfall", "Agile", "DevOps / CI-CD", "Manual Testing", "Preventive", "Local", "RAM", "Basic Encryption"],
    phases: [
      {
        id: "START_CONTEXT",
        type: "Initial Setup",
        service_category: "Analysis",
        description: "Granting access credentials to tracking boards (Jira, Linear, DevOps) and the customer's documentation repositories.",
        purpose: "Perform a check of the project's organizational and technical state of the art.",
        deliverables: [],
        customer_choices: ["business_domain", "application_domain"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "FREE_CALL",
        type: "Discovery Call",
        service_category: "Analysis",
        description: "Mapping of mandatory business deadlines, budget constraints, and communication issues encountered within the team.",
        purpose: "Frame managerial frictions and define the governance goal.",
        deliverables: [],
        customer_choices: ["duration", "payment_method"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "GOVERNANCE_ANALYSIS",
        type: "Slowdown & Capacity Analysis",
        service_category: "Analysis",
        description: "In-depth examination of the team's release processes, calculation of developer Velocity, and tracking of organizational inefficiencies.",
        purpose: "Issue a management health report and formulate an accurate estimate of the required coordination time.",
        deliverables: [
          buisness_service_info.Analysis.deliverables.bottleneckAnalysisReport,
          buisness_service_info.Analysis.deliverables.feasibilityStudy
        ],
        customer_choices: ["In-Depth Management Consulting with Operations Manual", "Fast Macro Planning at a reduced cost"],
        requires_approval: true,
        loop_on_rejection: "In-depth interview to recalibrate internal communication rules of the corporate team",
        is_paid: true
      },
      {
        id: "FRAMEWORK_SETUP",
        type: "Framework Choice & Master Gantt",
        service_category: "Design",
        description: "Definition of the workflow cycle (e.g., Scrum Sprints or Waterfall deadlines) and drafting the general Gantt schedule of production activities planned by date.",
        purpose: "Provide a clear timeline and methodological roadmap approved by stakeholders.",
        deliverables: [
          buisness_service_info.Design.deliverables.governanceHandbook,
          buisness_service_info.Security.deliverables.compliancePolicy
        ],
        customer_choices: ["Choice of Work Framework based on the customer's perspective emerged in the interview"],
        requires_approval: true,
        loop_on_rejection: "Remodulation of priorities or trimming feature scope to adhere to commercial dates",
        is_paid: false
      },
      {
        id: "TASK_SCHEDULING_SETUP",
        type: "Control Tools Configuration",
        service_category: "Integration",
        description: "Populating the operational backlog on digital platforms, assigning tasks to developers, and setting up control rules.",
        purpose: "Make workflows transparent, quantifiable, and inspectable at any time.",
        deliverables: [buisness_service_info.Integration.deliverables.controlPanelSetup],
        customer_choices: ["Approval of control boards configuration"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "MANAGEMENT_EXECUTION",
        type: "Sprint Supervision & Management",
        service_category: "Engineering & Maintenance",
        description: "Conducting Daily Standups, removing technical impediments for developers, planning Demos, and monitoring task progress.",
        purpose: "Guarantee work progress while eliminating delays.",
        deliverables: [
          buisness_service_info.EngineeringMaintenance.deliverables.weeklyProgressReports,
          buisness_service_info.Integration.deliverables.integrationReport
        ],
        customer_choices: ["Weekly verification of work progress reports"],
        requires_approval: false,
        is_paid: false
      },
      {
        id: "PROJECT_CLOSURE",
        type: "Project Closure & Handover",
        service_category: "Validation",
        description: "Final verification of correspondence between initial requirements and modules developed by the team, formalization of the release, and handover.",
        purpose: "Certify the correct closure of the engineering cycle within the established timeframes.",
        deliverables: [
          buisness_service_info.Validation.deliverables.closureLessonsLearned,
          buisness_service_info.Training.deliverables.handoverDoc,
          buisness_service_info.Validation.deliverables.validationChecklist
        ],
        customer_choices: ["Signing of the project closure report"],
        requires_approval: true,
        is_paid: false
      },
      {
        id: "POST_PRODUCTION",
        type: "Recurring Governance",
        service_category: "Training",
        description: "Commercial proposal for long-term continuous management of evolutionary releases or organizational support.",
        purpose: "Ensure managerial coordination even during the post-release lifecycle phase.",
        deliverables: [buisness_service_info.Training.deliverables.trainingSessionMaterials],
        customer_choices: ["Relying on the engineer for post-release governance (First 3 support tickets free)"],
        requires_approval: false,
        is_paid: false
      }
    ]
  }
];

const consulting_info = {
  title: "Consulting Service",
  buisness_domains_info: buisness_domains_info,
  application_domains_info: application_domains_info,
  job_categories_info: job_categories_info,
  payment_info: payment_info,
  buisness_service_info: buisness_service_info,
  price_per_slot: price_per_slot,
  slots_info: slots_info,
  models_info: models_info,
  consulting_flows_info: consulting_flows_info
};





const BaseNode = ({ data, children, themeColor }) => {
  const [opened, setOpened] = useState(false);

  const Field = ({ icon, label, value }) => (
    value && (Array.isArray(value) ? value.length > 0 : value.length > 0) ? (
      <Group gap="xs" align="flex-start" wrap="nowrap">
        {icon}
        <Stack gap={0} style={{ flex: 1 }}>
          <Text size="9px" c="dimmed" tt="uppercase" fw={700}>{label}</Text>
          <Text size="xs" fw={500}>{Array.isArray(value) ? value.join(', ') : value}</Text>
        </Stack>
      </Group>
    ) : null
  );

  // Determina se la fase è gratuita (0) o ha un costo
  const isFree = data.hourlyRate === 0;

  return (
    <Paper withBorder radius="lg" p="md" style={{ width: 300, background: '#fff', borderColor: themeColor, borderWidth: data.isPaid ? 2 : 1 }}>
      <Handle type="target" position={Position.Left} />
      
      <Group justify="space-between" mb="xs">
        <Text fw={800} size="sm" c={themeColor}>{data.type}</Text>
        <ActionIcon variant="subtle" size="xs" onClick={() => setOpened(!opened)}>
          {opened ? <IconChevronUp /> : <IconChevronDown />}
        </ActionIcon>
      </Group>

      <Stack gap="xs">
        {children}
        
        {/* Tutti i badge ora sono allineati nello stesso Group */}
        <Group gap="xs" wrap="nowrap"> 
          {data.isPaid && (
            <Badge color="green" size="xs" leftSection={<IconCreditCard size={10}/>}>Paid</Badge>
          )}
          {data.requiresApproval && (
            <Badge color="orange" size="xs" leftSection={<IconUserCheck size={10}/>}>Approval</Badge>
          )}

          {data.hourlyRate !== null && (
            <Badge 
              color={isFree ? "indigo" : "blue"} 
              variant={isFree ? "light" : "dot"} 
              size="xs" 
              styles={{ 
                root: { 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  whiteSpace: 'nowrap', // Impedisce l'andata a capo
                  paddingLeft: '6px', 
                  paddingRight: '6px' 
                }
              }}
            >
              {/* Stampiamo tutto come un unico blocco di testo */}
              {isFree ? "FREE" : `${data.hourlyRate} €/h`}
            </Badge>
          )}
        </Group>
      </Stack>

      <Collapse in={opened}>
        <Divider my="sm" />
        <Stack gap="sm">
          <Text size="xs" c="gray.6" fs="italic">{data.description}</Text>
          <Field icon={<IconPackage size={14}/>} label="Deliverables" value={data.deliverables} />
          <Field icon={<IconSettings size={14}/>} label="Customer Choices" value={data.customer_choices} />
        </Stack>
      </Collapse>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Top} id="top-target" style={{ opacity: 0 }} />
    </Paper>
  );
};



/* =================================================================
 * 2. SPECIALIZZAZIONE DEI NODI (Solo contenuto)
 * ================================================================= */

const DiscoveryNode = ({ data }) => (
  <BaseNode data={data} themeColor="#6366F1">
    <Text size="xs" c="dimmed">{data.purpose}</Text>
  </BaseNode>
);

const AnalysisNode = ({ data }) => (
  <BaseNode data={data} themeColor="#F59E0B">
    <Text size="xs" fw={600} c="amber.9">🎯 {data.purpose}</Text>
  </BaseNode>
);

const PlanningNode = ({ data }) => (
  <BaseNode data={data} themeColor="#8B5CF6">
    <Text size="xs" fw={600}>📋 Planning & Matrix</Text>
    <Text size="xs" c="dimmed">{data.purpose}</Text>
  </BaseNode>
);

const ValidationNode = ({ data }) => (
  <BaseNode data={data} themeColor="#EC4899">
    <Text size="xs" fw={600}>🛡️ {data.purpose}</Text>
  </BaseNode>
);

const ExecutionNode = ({ data }) => (
  <BaseNode data={data} themeColor="#10B981">
    <Text size="xs" fw={600}>⚙️ {data.purpose}</Text>
  </BaseNode>
);

/* =================================================================
 * 3. MAPPA E CONFIGURAZIONE
 * ================================================================= */
export const nodeTypes = {
  discovery: DiscoveryNode,
  analysis: AnalysisNode,
  planning: PlanningNode,
  validation: ValidationNode,
  execution: ExecutionNode,
};

/* ==========================================
 * 2. FACTORY TRASFORMAZIONE DATI
 * ========================================== */

export const generateReactFlowData = (flow) => {
  if (!flow || !Array.isArray(flow.phases)) return { nodes: [], edges: [] };

  const nodes = [];
  const edges = [];

  flow.phases.forEach((phase, index) => {
    // 1. Identificazione tipo
    let customType = 'execution';
    if (phase.id === 'START_CONTEXT' || phase.id === 'FREE_CALL') customType = 'discovery';
    else if (phase.id.includes('ANALYSIS') || phase.id.includes('INVESTIGATION') || phase.id.includes('AUDIT') || phase.id.includes('PROFILING')) customType = 'analysis';
    else if (phase.id.includes('PLANNING') || phase.id.includes('SCHEDULING') || phase.id.includes('CHOICE') || phase.id.includes('MATRIX')) customType = 'planning';
    else if (phase.id.includes('VALIDATION') || phase.id.includes('WALKTHROUGH') || phase.id.includes('DEMO')) customType = 'validation';

    // 2. Logica Prezzi: 0 se iniziale/discovery, altrimenti lookup
    const isFree = phase.id === 'START_CONTEXT' || phase.id === 'FREE_CALL';
    const categoryKey = phase.service_category?.replace(/[^a-zA-Z]/g, '');
    const serviceInfo = buisness_service_info[categoryKey];
    const hourlyRate = isFree ? 0 : (serviceInfo?.hourlyRate || null);

    // 3. Colore
    const colorMap = { discovery: '#6366F1', analysis: '#F59E0B', planning: '#8B5CF6', validation: '#EC4899', execution: phase.is_paid ? '#10B981' : '#3B82F6' };
    const themeColor = colorMap[customType] || '#3B82F6';

    nodes.push({
      id: phase.id,
      type: customType,
      position: { x: index * 400, y: phase.id.includes('DECISION') || phase.id.includes('PLANNING') ? 220 : 80 },
      data: { ...phase, hourlyRate, themeColor }
    });

    // 4. Edges con etichette leggibili
    if (index < flow.phases.length - 1) {
      edges.push({
        id: `e${index}`,
        source: phase.id,
        target: flow.phases[index + 1].id,
        type: 'smoothstep',
        animated: phase.is_paid,
        label: phase.requires_approval ? 'Approved ✅' : 'Advance ➡️',
        labelStyle: { fill: '#374151', fontSize: 11, fontWeight: 600 },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9, stroke: '#d1d5db', strokeWidth: 1 },
        labelBgPadding: [8, 4],
        labelBgRadius: 6,
        style: { stroke: phase.is_paid ? '#10B981' : '#3B82F6', strokeWidth: 2 }
      });
    }

    if (phase.requires_approval && phase.loop_on_rejection) {
      edges.push({
        id: `loop-${phase.id}`,
        source: phase.id,
        target: index > 0 ? flow.phases[index - 1].id : phase.id,
        targetHandle: 'top-target',
        type: 'smoothstep',
        label: 'Rejected ❌',
        labelStyle: { fill: '#EF4444', fontSize: 11, fontWeight: 600 },
        style: { stroke: '#EF4444', strokeWidth: 2, strokeDasharray: '5,5' }
      });
    }
  });

  return { nodes, edges };
};



export const ConsultingFlowGraph = ({ selectedJobFlow }) => {
  const [instance, setInstance] = useState(null);
  const containerRef = useRef(null);
  const { nodes, edges } = useMemo(() => generateReactFlowData(selectedJobFlow), [selectedJobFlow]);

  const maxY = useMemo(() => (nodes.length > 0 ? Math.max(...nodes.map(n => n.position.y)) + 250 : 500), [nodes]);
  const totalWidth = useMemo(() => (nodes.length > 0 ? Math.max(...nodes.map(n => n.position.x)) + 400 : 0), [nodes]);

  const smoothMove = useCallback((dx) => {
    if (!instance || !containerRef.current) return;
    
    const viewport = instance.getViewport();
    const startX = viewport.x;
    const zoom = viewport.zoom;
    const containerWidth = containerRef.current.clientWidth;
    const maxScroll = -(totalWidth * zoom - containerWidth);
    let targetX = Math.min(0, Math.max(maxScroll, startX + dx));

    const startTime = performance.now();
    const duration = 500;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const nextX = startX + (targetX - startX) * easeOutCubic;
      instance.setViewport({ x: nextX, y: viewport.y, zoom });
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [instance, totalWidth]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '15px', // Spazio tra le frecce e il grafo
      width: '100%', 
      height: `${maxY}px` 
    }}>
      
      {/* FRECCIA SINISTRA */}
      <ActionIcon 
        size={60} radius="xl" variant="light" color="blue" 
        onClick={() => smoothMove(400)}
        style={{ flexShrink: 0 }} // Impedisce alla freccia di restringersi
      >
        <IconChevronLeft size={40} />
      </ActionIcon>

      {/* CONTENITORE GRAFO */}
      <div 
        ref={containerRef} 
        style={{ 
          flex: 1, // Occupa tutto lo spazio disponibile tra le frecce
          height: '100%', 
          border: '1px solid #E5E7EB', 
          borderRadius: '12px', 
          overflow: 'hidden' 
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={setInstance}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          translateExtent={[[-totalWidth, 0], [totalWidth, maxY]]}
          minZoom={0.8}
          maxZoom={0.8}
          nodesDraggable={false}
          panOnScroll={false}
          zoomOnScroll={false}
        >
          <Background color="#e2e8f0" gap={16} size={1} />
        </ReactFlow>
      </div>

      {/* FRECCIA DESTRA */}
      <ActionIcon 
        size={60} radius="xl" variant="light" color="blue" 
        onClick={() => smoothMove(-400)}
        style={{ flexShrink: 0 }}
      >
        <IconChevronRight size={40} />
      </ActionIcon>
    </div>
  );
};

/* ==========================================
 * 4. CONTENITORE CON SELETTORE
 * ========================================== */
export function ConsultingActivitiyGraph() {
  const [selectedJob, setSelectedJob] = useState('Prototyping & Proof of Concept');

  const currentFlow = useMemo(() => {
    const list = Array.isArray(consulting_flows_info) ? consulting_flows_info : [];
    return list.find(f => f.job_category === selectedJob) || null;
  }, [selectedJob]);

  const selectData = Array.isArray(job_categories) && job_categories.length > 0 
    ? job_categories 
    : ['Prototyping & Proof of Concept'];

  return (
    <div style={{ padding: '1rem' }}>
      <Select 
        label="Select your Delivery"
        value={selectedJob}
        onChange={(val) => setSelectedJob(val || '')}
        data={selectData}
      />

      <div style={{ marginTop: '2rem' }}>
        <ConsultingFlowGraph selectedJobFlow={currentFlow} />
      </div>
    </div>
  );
}




function SectionWrapper({ title, intro, outro, children, bgColor = 'transparent' }) {
  return (
    <section style={{ padding: '60px 0', backgroundColor: bgColor }}>
      <Container size="xl">
        <Stack gap="lg" align="center" mb="xl">
          <Title order={2}>{title}</Title>
          {intro && <Text size="lg" c="dimmed" ta="center" maw={800}>{intro}</Text>}
        </Stack>
        
        {children}
        
        {outro && (
          <Text size="md" ta="center" mt={40} fw={500} c="blue">
            {outro}
          </Text>
        )}
      </Container>
    </section>
  );
}

function InfoCard({ title, icon, desc }) {
  return (
    <Paper withBorder p="xl" radius="lg" shadow="sm" h="100%">
      <Group mb="sm">
        <ThemeIcon size={40} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
          {icon}
        </ThemeIcon>
        <Text fw={700} size="xl">{title}</Text>
      </Group>
      <Text size="sm" c="dimmed" fs="italic">
        {desc}
      </Text>
    </Paper>
  );
}

export function BusinessDomainsSection({ data = consulting_info.buisness_domains }) {
  return (
    <SectionWrapper 
      title={data.title} 
      intro={data.intro}
      outro={data.outro}
    >
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {data.items.map((item) => (
            <InfoCard key={item.name} icon={item.icon} title={item.name} desc={item.desc} />
          ))}
        </SimpleGrid>
    </SectionWrapper>
  );
}

// Sezione Application Domains
export function ApplicationDomainsSection({ data = consulting_info.application_domains }) {
  return (
    <section style={{ padding: '60px 0' }}>
      <SectionWrapper 
        title={data.title} 
        intro={data.intro} 
        outro={data.outro}
      >
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {data.items.map((item) => (
            <InfoCard key={item.name} icon={item.icon} title={item.name} desc={item.desc} />
          ))}
        </SimpleGrid>
      </SectionWrapper>
    </section>
  );
}

// Sezione Job Categories
export function JobCategoriesSection({ data = consulting_info.job_categories }) {
  return (
    <section style={{ padding: '60px 0', background: 'var(--mantine-color-gray-0)' }}>
      <SectionWrapper 
        title={data.title} 
        intro={data.intro} 
        outro={data.outro}
      >
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {data.items.map((item) => (
            <InfoCard key={item.name} icon={item.icon} title={item.name} desc={item.desc} />
          ))}
        </SimpleGrid>
     </SectionWrapper> 
    </section>
  );
}




export function ConsultingExplorer({ businessData, appData, jobData }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { component: <BusinessDomainsSection data={businessData} /> },
    { component: <ApplicationDomainsSection data={appData} /> },
    { component: <JobCategoriesSection data={jobData} /> }
  ];

  const next = () => setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prev = () => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <Box py={60}>
      <Title order={1} ta="center" mb={40}>Explore Your Consulting Path</Title>

      {/* Container principale con Flex per centrare verticalmente */}
      <Flex justify="center" align="center" gap="md" style={{ position: 'relative' }}>
        
        {/* Freccia Indietro - Centrata verticalmente */}
        <ActionIcon 
          size={50} 
          variant="outline" 
          onClick={prev}
          style={{ flexShrink: 0 }}
        >
          <IconChevronLeft size={30} />
        </ActionIcon>

        {/* Area Contenuto - Larghezza fissa per evitare salti */}
        <Box style={{ width: '100%', maxWidth: '1000px', minHeight: '500px' }}>
          <Transition mounted={true} transition="fade" duration={300}>
            {(styles) => (
              <div style={styles}>
                {slides[activeSlide].component}
              </div>
            )}
          </Transition>
        </Box>

        {/* Freccia Avanti - Centrata verticalmente */}
        <ActionIcon 
          size={50} 
          variant="outline" 
          onClick={next}
          style={{ flexShrink: 0 }}
        >
          <IconChevronRight size={30} />
        </ActionIcon>

      </Flex>
      
      {/* Indicatori in basso */}
      <Flex justify="center" mt="xl" gap="sm">
        {slides.map((_, idx) => (
          <Box 
            key={idx} 
            style={{ 
              width: activeSlide === idx ? 24 : 10, 
              height: 10, 
              borderRadius: 5, 
              backgroundColor: activeSlide === idx ? 'var(--mantine-color-blue-6)' : '#ccc',
              transition: 'width 0.3s'
            }} 
          />
        ))}
      </Flex>
    </Box>
  );
}


function getFieldErrors(info) {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (info.name !== undefined && info.name !== "" && !info.name?.trim()) errors.name = "Full name is required.";
  if (info.email !== undefined && info.email !== "" && !emailRegex.test(info.email)) errors.email = "Invalid email format.";
  
  // Validazione Whitelist
  if (info.business_domain && !ALLOWED_CONSULTING_BOOK_FORM_VALUES.business_domains.includes(info.business_domain)) {
     errors.business_domain = "Invalid domain.";
  }
  if (info.application_domain && !ALLOWED_CONSULTING_BOOK_FORM_VALUES.application_domains.includes(info.application_domain)) {
     errors.application_domain = "Invalid application domain.";
  }
  if (info.job_category && !ALLOWED_CONSULTING_BOOK_FORM_VALUES.job_categories.includes(info.job_category)) {
     errors.job_category = "Invalid category.";
  }
  if (info.duration && !ALLOWED_CONSULTING_BOOK_FORM_VALUES.durations.includes(info.duration)) {
     errors.duration = "Invalid duration.";
  }


  return errors;
}


export function BookingFormSection({ info = {}, setInfo, onBook, loading }) {
  const [formErrors, setFormErrors] = useState({});

  

  const handleChange = (field, value) => {
    const newInfo = { ...info, [field]: value };
    setInfo(newInfo);
    setFormErrors(getFieldErrors(newInfo));
  };

  const handleBookSubmit = () => {
    const finalErrors = getFieldErrors(info);
    if (Object.keys(finalErrors).length > 0) {
      setFormErrors(finalErrors);
      return;
    }
    onBook();
  };

  useEffect(() => {
    // 1. Definiamo i valori di default dai nostri array
    const defaultBusiness = ALLOWED_CONSULTING_BOOK_FORM_VALUES.business_domains[0];
    const defaultApplication = ALLOWED_CONSULTING_BOOK_FORM_VALUES.application_domains[0];
    const defaultJob = ALLOWED_CONSULTING_BOOK_FORM_VALUES.job_categories[0];
    const defaultDuration = ALLOWED_CONSULTING_BOOK_FORM_VALUES.durations[0];
    const defaultPayment = ALLOWED_CONSULTING_BOOK_FORM_VALUES.payment_methods[0];

    // 2. Creiamo un oggetto con solo i valori mancanti nell'info attuale
    const updates = {};
    if (!info.business_domain) updates.business_domain = defaultBusiness;
    if (!info.application_domain) updates.application_domain = defaultApplication;
    if (!info.job_category) updates.job_category = defaultJob;
    if (!info.duration) updates.duration = defaultDuration;
    if (!info.payment) updates.payment = defaultPayment;

    // 3. Se ci sono cambiamenti necessari, aggiorniamo lo stato una sola volta
    if (Object.keys(updates).length > 0) {
      setInfo(prev => ({ ...prev, ...updates }));
    }
  }, []);

  return (
    <Paper withBorder p="xl" radius="lg" shadow="sm">
      <Title order={3} mb="xl" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <IconCalendarEvent /> Schedule Consulting Session
      </Title>

      <Grid gutter="xl">
        {/* Colonna Data e Orario */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box p="md" style={{ border: '1px solid #eee', borderRadius: '12px' }}>
            <DateTimePicker
              label="Pick date and time"
              value={info.date}
              onChange={(val) => handleChange('date', val)}
              error={formErrors.date}
              leftSection={<IconCalendarEvent size={16} />}
            />
          </Box>
        </Grid.Col>

        {/* Colonna Dati Tecnici */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <Group grow>
              <TextInput label="Full Name / Company Name" value={info.name} onChange={(e) => handleChange('name', e.target.value)} error={formErrors.name} />
              <TextInput label="Email" value={info.email} onChange={(e) => handleChange('email', e.target.value)} error={formErrors.email} />
            </Group>

            <SimpleGrid cols={2}>
              <Select label="Business Domain" data={ALLOWED_CONSULTING_BOOK_FORM_VALUES.business_domains} value={info.business_domain} onChange={(val) => handleChange('business_domain', val)} error={formErrors.business_domain} />
              <Select label="Application Domain" data={ALLOWED_CONSULTING_BOOK_FORM_VALUES.application_domains} value={info.application_domain} onChange={(val) => handleChange('application_domain', val)} error={formErrors.application_domain} />
            </SimpleGrid>

            <Select label="Job Category" data={ALLOWED_CONSULTING_BOOK_FORM_VALUES.job_categories} value={info.job_category} onChange={(val) => handleChange('job_category', val)} error={formErrors.job_category} />

            <Group grow>
              <Select label="Duration" data={ALLOWED_CONSULTING_BOOK_FORM_VALUES.durations} value={info.duration} onChange={(val) => handleChange('duration', val)} />
              <Select label="Payment Preference" data={[{label: 'Pay Now', value: 'pay-now'}, {label: 'Pay Later', value: 'pay-later'}]} value={info.payment} onChange={(val) => handleChange('payment', val)} />
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>

      <Button fullWidth mt="xl" size="lg" onClick={handleBookSubmit} loading={loading}>
        Confirm Consultation
      </Button>
    </Paper>

  );
}


function validateBookingData(info) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!info.name?.trim()) return "Full name is required.";
  if (!info.email || !emailRegex.test(info.email)) return "A valid email is required.";
  if (!info.date) return "Please select a date and time for the consultation.";
  
  // Correzione nomi (usa i plurali definiti in ALLOWED_CONSULTING_BOOK_FORM_VALUES)
  if (!ALLOWED_CONSULTING_BOOK_FORM_VALUES.business_domains.includes(info.business_domain)) {
    return "Please select a valid business domain.";
  }
  
  if (!ALLOWED_CONSULTING_BOOK_FORM_VALUES.application_domains.includes(info.application_domain)) {
    return "Please select a valid application domain.";
  }
  
  if (!ALLOWED_CONSULTING_BOOK_FORM_VALUES.job_categories.includes(info.job_category)) {
    return "Please select a valid consulting category.";
  }

  if (!ALLOWED_CONSULTING_BOOK_FORM_VALUES.durations.includes(info.duration)) {
    return "Invalid duration selected.";
  }
  
  if (!ALLOWED_CONSULTING_BOOK_FORM_VALUES.payment_methods.includes(info.payment)) {
    return "Invalid payment method.";
  }

  return null;
}

function getSubjects(lessonsTree) {
  if (!lessonsTree?.children) return [];
  return lessonsTree.children.map(child => child.name);
}




export default function Lessons() {
  const [search, setSearch] = useState('');
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [lessonsTree, setLessonsTree] = useState(null);
  const [consulting_info, setConsultingInfo] = useState({
    name: '',
    email: '',
    buisness_domain: '',
    application_domain: '',
    job_category: '',
    job_description: '',
    title:'',
    date: null,
    time: '',
    duration: '1h',
    payment: 'pay-later'
  });


  async function handleFormSubmit() {
    // 1. Validazione base
    const errorMsg = validateBookingData(consulting_info);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    
    // 2. Controllo data selezionata nel form
    if (!consulting_info.date) {
      alert("Please select a date and time!");
      return;
    }

    setBookingLoading(true);

    try {
      const idempotencyKey = crypto.randomUUID();
      
      // Convertiamo la data del DateTimePicker in formato ISO
      const startTime = consulting_info.date.toISOString();
      // Calcoliamo l'end time basato sulla durata scelta nel form
      const durationMs = consulting_info.duration === '1h' ? 3600000 : 7200000;
      const endTime = new Date(consulting_info.date.getTime() + durationMs).toISOString();

      // 3. Chiamata al tuo backend (stessa logica del vecchio bookSlot)

      alert("StartTime in ISO format" && startTime);
      
      const reserveRes = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/reserve-slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: startTime, idempotencyKey }),
      });

      if (!reserveRes.ok) throw new Error("This slot is no longer available.");
      const { token } = await reserveRes.json();

      const request_tx_timestamp = new Date().toISOString();

      const bookRes = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: startTime,
          end: endTime,
          name: consulting_info.name,
          email: consulting_info.email,
          title: consulting_info.title,
          buisness_domain: consulting_info.buisness_domain,
          application_domain: consulting_info.application_domain,
          job_category: consulting_info.job_category,
          job_description: consulting_info.job_description,
          lockToken: token,
          idempotencyKey,
          tutoring_event_id: `${consulting_info.duration}-${consulting_info.payment === 'pay-now' ? 'stripe' : 'manual'}`,
          request_tx_timestamp
          
        }),
      });

      if (!bookRes.ok) throw new Error("Booking failed");

      alert("Booking successful!");
      // Ora puoi reindirizzare a una pagina di ringraziamento o confermare a video
    } catch (err) {
      alert(err.message);
    } finally {
      setBookingLoading(false);
    }
  }

  async function bookSlot(slot, lesson_info) {
    setBookingLoading(true);

    try {
      const idempotencyKey = crypto.randomUUID();

      // 1. RESERVE SLOT
      const reserveRes = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/reserve-slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: slot.startTime,
          idempotencyKey,
        }),
      });

      if (!reserveRes.ok) {
        const err = await reserveRes.json();
        alert(err.error || "Slot not available");
        return;
      }

      const { token } = await reserveRes.json();
      const paymentType = lesson_info.payment === 'pay-now' ? 'stripe' : 'manual';
      const eventKey = `${lesson_info.duration}-${paymentType}`;

      const errorMsg = validateBookingData(lesson_info, lessonsTree);
      if (errorMsg) {
        alert(errorMsg);
        return;
      }
      
      const request_tx_timestamp = new Date().toISOString();

      // 2. BOOK SLOT
      const bookRes = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: slot.startTime,
          end: slot.endTime,
          name: lesson_info.name,
          email: lesson_info.email,
          title: lesson_info.title,
          lockToken: token,
          idempotencyKey,
          tutoring_event_id: eventKey,
          subject: lesson_info.subject,
          type: lesson_info.type,
          request_tx_timestamp: request_tx_timestamp
        }),
      });

      if (!bookRes.ok) {
        const err = await bookRes.json();
        alert(err.error || "Booking failed");
        return;
      }

      const data = await bookRes.json();

      // 3. SUCCESS ONLY
      window.open(CAL_CONSULTING_LINK, "_blank");

    } catch (err) {
      alert(err.message || "Unexpected error");
    } finally {
      setBookingLoading(false);
    }
  }



  
  // 2. Sposta qui gli useEffect
  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoadingAvailability(true);
        const res = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/availability`);
        
        // Controlliamo il tipo di risposta
        console.log("Stato risposta:", res.status); 
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        console.log("Dati ricevuti dal browser:", data);
        setAvailabilityData(data?.slots || []); 
      } catch (err) {
        console.error("ERRORE CRITICO:", err); // <-- Guarda qui nella console
        setError("Cannot load availability");
      } finally {
        setLoadingAvailability(false);
      }
    }
    loadAvailability();
  }, []);

  useEffect(() => {
    fetch('/resources-tree.json')
        .then(res => res.json())
        .then(data => setLessonsTree(data))
        .catch(err => console.error('Failed to load resources tree:', err));
  }, []);

  // Questa funzione prepara il form e apre il modal
  const handleSlotSelect = (slot) => {
    setConsultingInfo(prev => ({
      ...prev,
      date: new Date(slot.start) // Imposta la data cliccata
    }));
    setModalOpened(true);
  };

  const handleBook = async () => {
    await handleFormSubmit(); 
    setModalOpened(false);
  };

  const handleDurationSelect = (duration) => {
    setConsultingInfo(prev => ({ ...prev, duration: duration }));
    setModalOpened(true);
  
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="lessons-container">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        <ConsultingInfoSection buisness_domains_info={buisness_domains_info} application_domains_info={application_domains_info} job_categories_info={job_categories_info}/>
        <ConsultingExplorer businessData={buisness_domains_info} appData={application_domains_info} jobData={job_categories_info}/>
        <ModelsSection data={models_info}/>
        <ConsultingProcessSection/>
        <BookingFormSection 
          info={consulting_info} 
          setInfo={setConsultingInfo}
          onBook={handleFormSubmit}        // <--- Qui passi la funzione
          loading={bookingLoading}        // <--- Qui passi lo stato di caricamento
        />
        <PricingSection onDurationSelect={handleDurationSelect} />
         <br/>
         <br/>
         <LicensingSection />
        <br/>
         <br/>
        <AvailabilitySection 
          availabilityData={availabilityData}
          loading={loadingAvailability}
          onSlotSelect={handleSlotSelect} // Passiamo il trigger
        />
        <br/>
        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} size="lg">
          <BookingFormSection 
            info={consulting_info} 
            setInfo={setConsultingInfo}
            onBook={handleFormSubmit}        // <--- Qui passi la funzione
            loading={bookingLoading}        // <--- Qui passi lo stato di caricamento
          />
        </Modal>
        <br/>
        <br/>
        <ResourcesSection 
          lessonsTree={lessonsTree} // Passa il dato
        />
        <br/>
        <br/>
        <br/>
      </div>
    </div>
  );
}

const getCategoryColor = (index) => {
  const colors = ['blue', 'indigo', 'cyan', 'teal', 'grape', 'violet', 'orange', 'red', 'pink'];
  return colors[index % colors.length];
};

export function LicensingSection() {
  return (
    <Box py={80} style={{ backgroundColor: '#f8fbff' }}>
      <Container size="lg">
        <Stack align="center" mb={50}>
          <Title order={2}>Licensing & Intellectual Property</Title>
          <Text c="dimmed" ta="center" maw={600}>
            Clear, transparent terms ensure you have the right control and legal framework for your project assets.
          </Text>
        </Stack>

        <Tabs defaultValue="usage" variant="pills" color="blue" orientation="vertical">
          <Tabs.List mb={40} style={{ minWidth: 220 }}>
            <Tabs.Tab value="usage" leftSection={<IconLicense size={16} />}>Usage License</Tabs.Tab>
            <Tabs.Tab value="resale" leftSection={<IconFileCode size={16} />}>Source (Internal)</Tabs.Tab>
            <Tabs.Tab value="saas" leftSection={<IconCloud size={16} />}>SaaS Model</Tabs.Tab>
            <Tabs.Tab value="escrow" leftSection={<IconLock size={16} />}>Escrow Service</Tabs.Tab>
            <Tabs.Tab value="buyout" leftSection={<IconShoppingCart size={16} />} color="orange">Full Buy-out</Tabs.Tab>
          </Tabs.List>

          <Box pl={30}>
            <Tabs.Panel value="usage">
              <LicensingCard 
                title="Usage License (Binaries only)"
                description="Turnkey solution for internal enterprise operations."
                points={[
                  "Delivery: Executable binaries or Docker containers.",
                  "Restriction: For internal business use only. Redistribution is strictly prohibited.",
                  "Ownership: Source code remains my property."
                ]}
              />
            </Tabs.Panel>

            <Tabs.Panel value="resale">
              <LicensingCard 
                title="Source Code (Internal Use Restricted)"
                description="Best for auditability and long-term control of your internal tools."
                points={[
                  "Delivery: Full access to the source code repository.",
                  "Restriction: 'The Client is granted a non-exclusive license for internal business operations. Any distribution, resale, or sub-licensing to third parties is strictly prohibited.'",
                  "Ownership: IP of custom business logic is yours; proprietary modules remain mine."
                ]}
              />
            </Tabs.Panel>

            <Tabs.Panel value="saas">
              <LicensingCard 
                title="SaaS Model (Subscription)"
                description="Software as a service for stable, scalable performance."
                points={[
                  "Delivery: Hosted platform managed by my infrastructure.",
                  "Restriction: Service is licensed by seat or volume; no code distribution.",
                  "Outcome: Total peace of mind while I handle technical maintenance and scaling."
                ]}
              />
            </Tabs.Panel>

            <Tabs.Panel value="escrow">
              <LicensingCard 
                title="Source Code Escrow"
                description="The safety-first balance between your control and my IP protection."
                points={[
                  "Process: Source code deposited with a neutral third-party agent.",
                  "Trigger Clause: Release only if I cease business operations or support.",
                  "Restriction: No code access during active service term."
                ]}
              />
            </Tabs.Panel>

            <Tabs.Panel value="buyout">
              <LicensingCard 
                title="Commercial Buy-out (Full Ownership)"
                description="Complete transfer of rights for commercial product scaling."
                points={[
                  "Status: Full transfer of all Intellectual Property Rights (IPR).",
                  "Freedom: The software is 100% yours to resell, redistribute, or license to others.",
                  "Pricing: Calculated as a capital asset sale (Buy-out Fee), exceeding standard development rates."
                ]}
                badge="Premium"
              />
            </Tabs.Panel>
          </Box>
        </Tabs>

        <Paper withBorder p="xl" mt={40} bg="gray.0">
          <Title order={4} mb="md">Note on Open Source vs. Proprietary Licensing</Title>
          <Text size="sm" c="gray.7" lh={1.6}>
            You might have heard of licenses like <b>MIT, Apache, or BSD</b>. These are "Public Licenses" intended for code released to the general public, where anyone can freely use, modify, and resell your work.
            <br /><br />
            For custom business solutions, we utilize <b>Proprietary Development Agreements (SDA)</b>. This ensures that the intellectual property is handled as a private business asset, tailored specifically to your security and commercial needs, rather than being released into the public domain.
          </Text>
        </Paper>


        {/* Legal Agreements Glossary */}
        <Box mt={80}>
          <Title order={3} ta="center" mb={30}>
            <IconGavel size={24} style={{ verticalAlign: 'middle', marginRight: 10 }} />
            Understanding Our Legal Agreements
          </Title>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <AgreementCard title="EULA (End User License Agreement)" 
              text="Applicable to Usage & SaaS models. It prohibits reverse engineering and unauthorized redistribution, ensuring the software is used strictly as a service." />
            
            <AgreementCard title="Software Development Agreement (SDA)" 
              text="Applicable to Internal Source models. Includes a 'Restricted Field of Use' clause, legally limiting the software to your core business operations and forbidding commercial resale." />
            
            <AgreementCard title="IP Assignment & Buy-out Agreement" 
              text="Applicable to Full Buy-out. A definitive legal act transferring total ownership of the asset from the developer to you." />
            
            <AgreementCard title="Escrow Agreement" 
              text="Applicable to Escrow Service. Governs the neutral third-party holding of the source code and the specific 'Release Trigger' conditions." />
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}

function LicensingCard({ title, description, points, badge }) {
  return (
    <Paper withBorder p="xl" radius="lg" shadow="sm" bg="white">
      <Group justify="space-between" mb="sm">
        <Title order={3}>{title}</Title>
        {badge && <Badge color="orange">{badge}</Badge>}
      </Group>
      <Text c="dimmed" mb="md">{description}</Text>
      <List spacing="sm" size="sm" icon={<ThemeIcon color="blue" size={20} radius="xl"><IconShieldCheck size={12} /></ThemeIcon>}>
        {points.map((p, i) => <List.Item key={i}>{p}</List.Item>)}
      </List>
    </Paper>
  );
}

function AgreementCard({ title, text }) {
  return (
    <Paper withBorder p="md">
      <Text fw={700} c="blue">{title}</Text>
      <Text size="sm" mt={5} c="gray.7">{text}</Text>
    </Paper>
  );
}

export function HeroSection() {
  return (
    <section style={{ padding: '140px 20px', background: 'linear-gradient(135deg, #f8fbff 0%, #ffffff 100%)' }}>
      <Container size="lg">
        <Stack gap="lg" align="center" ta="center">
          <Badge size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} radius="xl" px={20}>
            Engineering & Strategic Consulting 2026
          </Badge>

          <Title order={1} style={{ fontSize: 'clamp(40px, 8vw, 68px)', lineHeight: 1.05, maxWidth: '900px', letterSpacing: '-1px' }}>
            From <Text span c="blue" inherit>Prototype</Text> to Industrial Scale.
          </Title>

          {/* INSERIMENTO STRATEGICO: Empatia e Soluzione */}
          <Text size="xl" c="blue.8" fw={500} maw={800} mt={10} style={{ fontStyle: 'italic' }}>
            "Have a vision but don't know where to start? Whether modernizing legacy systems, 
            hardening security, or building from scratch—I turn your technical challenges into solutions."
          </Text>

          <Text size="lg" c="dimmed" maw={700} style={{ lineHeight: 1.6 }}>
            I bridge the gap between PoC and production. Define your domain, strategize your needs, 
            and book your dedicated engineering support.
          </Text>

          {/* GUIDA AL PERCORSO DI CONSULENZA */}
          <Stack mt={60} maw={900} gap="xl" style={{ textAlign: 'left' }}>
            <Text size="lg" fw={600} ta="center" c="blue">How to build your Consulting Journey</Text>
            
            <Text size="md" c="dimmed" style={{ lineHeight: 1.7 }}>
              This platform is designed to be your <b>strategic compass</b>. Before booking, you are guided through a structured selection process to ensure our session is immediately productive:
            </Text>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
              <Stack gap="xs">
                <Text fw={700}>1. Context Mapping</Text>
                <Text size="sm" c="dimmed">Choose your <b>Business Domain</b> and <b>Application Domain</b>. This aligns our discussion with your specific industry standards and technical environment.</Text>
              </Stack>
              <Stack gap="xs">
                <Text fw={700}>2. Select Your Role</Text>
                <Text size="sm" c="dimmed">Pick the <b>Job Category</b> you need. From <i>Prototyping</i> to <i>Architecture Audits</i> or <i>DevOps Industrialization</i>, choose the expertise required to solve your challenge.</Text>
              </Stack>
              <Stack gap="xs">
                <Text fw={700}>3. Explore Strategy Models</Text>
                <Text size="sm" c="dimmed">Deep dive into our <b>Technical Models</b>: Lifecycle, Deployment, and Security. Defining these in advance clarifies your requirements for <i>scalability</i>, <i>speed</i>, or <i>resilience</i>.</Text>
              </Stack>
            </SimpleGrid>
            <br/>
            <Text size="lg" fw={600} ta="center" c="blue">We offer End-to-End Consulting</Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt={40}>
              <Stack gap="xs">
                <Text fw={700}>1. Analysis & Strategy</Text>
                <Text size="sm" c="dimmed">
                  We provide investigative analysis, requirements gathering, and detailed activity roadmaps (Gantt). 
                  This phase is dedicated to supporting your decision-making and ensuring clear, actionable activity planning.
                </Text>
              </Stack>
              
              <Stack gap="xs">
                <Text fw={700}>2. Development & Production</Text>
                <Text size="sm" c="dimmed">
                  From PoC to full-scale deployment, we offer end-to-end development services. 
                  We focus on delivering robust, high-quality solutions tailored to your specific operational needs.
                </Text>
              </Stack>
              
              <Stack gap="xs">
                <Text fw={700}>3. Maintenance & Administration</Text>
                <Text size="sm" c="dimmed">
                  Our support extends beyond deployment. We provide ongoing system maintenance, administrative oversight, 
                  and health monitoring to ensure your software remains secure, stable, and performing at its best.
                </Text>
              </Stack>
            </SimpleGrid>

            {/* BOX INFORMATIVO PRENOTAZIONI */}
            <Paper withBorder p="md" bg="blue.0" mt={20}>
              <Text fw={600} c="blue.8" mb="xs">Flexible Consulting & Payments</Text>
              <Text size="sm" c="gray.7">
                Once ready, you can book a session for <b>30 min, 1 hour, or 2 hours</b> directly below. 
                We offer total flexibility: <b>Pay Now</b> to secure your slot immediately, or <b>Pay Later</b>. 
                <i>Note: A 20% deposit is required for all bookings, and your first 30 minutes of discovery are always on me.</i>
              </Text>
            </Paper>
          </Stack>

          <Group justify="center" mt="xl" gap="md">
            <Button size="xl" radius="md" component="a" href="#booking" leftSection={<IconRocket size={20} />}>
              Schedule Your Session
            </Button>
            <Button size="xl" radius="md" variant="outline" component="a" href="#expertise">
              Explore Domains
            </Button>
          </Group>
        </Stack>
      </Container>
    </section>
  );
}
/**
 * SYSTEM_MODELS_DATA
 * Comprehensive configuration for all architectural, testing, deployment, and security models.
 */
const getMetricValue = (val) => {
  const map = { 'None': 0, 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5, 'Extreme': 5 };
  return map[val] || 3; 
};

function ModelCard({ item }) {
  const [opened, setOpened] = useState(false);

  return (
    <Paper withBorder p="md" radius="lg" shadow="xs" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header con Titolo e Bottone + */}
      <Group justify="space-between" align="center" mb={item.desc ? "xs" : "md"}>
        <Text fw={800} size="lg" c="blue">{item.name}</Text>
        <ActionIcon 
          variant="light" 
          color="blue" 
          radius="xl" 
          size="lg" 
          onClick={() => setOpened(!opened)}
          style={{ transform: opened ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <IconPlus style={{ width: rem(20), height: rem(20) }} />
        </ActionIcon>
      </Group>

      {/* Descrizione (sempre visibile o nel collapse) */}
      {item.desc && (
        <Text size="sm" c="dimmed" mb="md" fs="italic">
          {item.desc}
        </Text>
      )}

      {/* Area Espandibile per gli altri metadati */}
      <Collapse in={opened}>
        <Stack gap="sm" mb="md">
          {Object.entries(item)
            .filter(([k]) => !['name', 'desc', 'Complexity', 'Automation', 'Scalability', 'Security', 'securityLevel'].includes(k))
            .map(([k, v]) => (
              <div key={k}>
                <Text size="xs" fw={700} tt="capitalize">{k}:</Text>
                <Text size="xs" c="dimmed">{Array.isArray(v) ? v.join(', ') : v}</Text>
              </div>
            ))}
        </Stack>
      </Collapse>

      {/* Cruscotto Metriche (sempre visibile) */}
      <Stack gap="xs" mt="auto">
        {Object.entries(item)
          .filter(([k]) => ['Complexity', 'Automation', 'Scalability', 'Security', 'securityLevel'].includes(k))
          .map(([k, v]) => (
            <div key={k}>
              <Group justify="space-between" mb={2}>
                <Text size="xs" fw={700} tt="uppercase" c="dimmed">{k}</Text>
                <Text size="xs" fw={700}>{v}</Text>
              </Group>
              <Progress value={getMetricValue(v) * 20} size="sm" color="blue" />
            </div>
        ))}
      </Stack>
    </Paper>
  );
}

export function ModelsSection({ data }) {
  const [activeTab, setActiveTab] = useState(data[0]?.category);

  const changeTab = (dir) => {
    const idx = data.findIndex(d => d.category === activeTab);
    setActiveTab(data[(idx + dir + data.length) % data.length].category);
  };

  return (
    <section style={{ padding: '60px 0', background: '#f8f9fa' }}>
      <Container size="xl">
        <Title order={2} ta="center" mb={10}>Technical Strategy Models</Title>
        <Text ta="center" mb={40} c="dimmed">Complete technical breakdown with performance KPIs.</Text>

        <Tabs value={activeTab} onChange={setActiveTab} variant="pills" justify="center">
          <Tabs.List 
            mb={40} 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              gap: '15px' 
            }}
          >
            {data.map((cat) => (
              <Tabs.Tab 
                key={cat.category} 
                value={cat.category}
                style={{
                  padding: '14px 35px',
                  fontSize: '17px',
                  fontWeight: 600,
                  borderRadius: '50px',
                  minWidth: '160px',
                  textAlign: 'center'
                }}
              >
                {cat.category}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {data.map((category) => (
            <Tabs.Panel key={category.category} value={category.category}>
              {/* QUI INSERIAMO LA DESCRIZIONE DINAMICA */}

              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
                {category.items.map((item) => (
                  <ModelCard key={item.name} item={item} />
                ))}
              </SimpleGrid>
            </Tabs.Panel>
          ))}
        </Tabs>

        <Group justify="center" mt={40}>
          <ActionIcon size="lg" radius="xl" onClick={() => changeTab(-1)}><IconChevronLeft /></ActionIcon>
          <ActionIcon size="lg" radius="xl" onClick={() => changeTab(1)}><IconChevronRight /></ActionIcon>
        </Group>
      </Container>
    </section>
  );
}


function getFolderStats(node) {
  let stats = {
    // Basic metrics
    files: 0,
    sizeBytes: 0,
    sizeKb: 0,
    lastModified: node.lastModified || 0,
    
    // Rich metadata
    extensions: new Set(),
    
    // Legacy alias (for code expecting 'count')
    get count() { return this.files; }
  };

  const walk = (n) => {
    if (n.type === 'file') {
      stats.files += 1;
      stats.sizeBytes += (n.size || 0);
      stats.sizeKb += (n.size || 0) / 1024;
      
      // Update last modified based on the latest file
      stats.lastModified = Math.max(stats.lastModified, n.lastModified || 0);
      
      // Extract file extensions
      const ext = n.name.split('.').pop().toLowerCase();
      stats.extensions.add(ext);
      
    } else if (n.children) {
      n.children.forEach(walk);
    }
  };

  walk(node);

  // Convert Set to Array for easier consumption
  return {
    ...stats,
    extensions: Array.from(stats.extensions)
  };
}


export function ConsultingInfoSection({ buisness_domains_info, application_domains_info, job_categories_info }) {
  // Prepariamo i dati dei tab
  const consultingSections = [
    { 
      label: "Business Domains",
      title: buisness_domains_info.title, 
      data: buisness_domains_info.items, 
      icon: <IconTargetArrow size={24} /> 
    },
    { 
      label: "Applications",
      title: application_domains_info.title, 
      data: application_domains_info.items, 
      icon: <IconCpu size={24} /> 
    },
    { 
      label: "Technical Roles",
      title: job_categories_info.title, 
      data: job_categories_info.items, 
      icon: <IconTools size={24} /> 
    }
  ];

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#f9fafb' }}>
      <Container size="xl">
        <Title order={2} ta="center" mb={10}>Professional Engineering Consulting</Title>
        <Text ta="center" c="dimmed" mb={60} size="lg">Strategic support for high-stakes engineering and software challenges.</Text>

        {/* --- Info Context (Who & Workflow) --- */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb={80}>
          <Paper withBorder p="xl" radius="lg" shadow="sm">
            <Group mb="md">
              <ThemeIcon size={40} color="blue"><IconUsers size={22} /></ThemeIcon>
              <Title order={3}>Who is it for?</Title>
            </Group>
            <List spacing="sm" size="sm" icon={<IconCheck size={16} color="teal"/>}>
              <List.Item>CTOs and Lead Developers seeking architectural guidance.</List.Item>
              <List.Item>Scale-up companies needing to industrialize their codebase.</List.Item>
              <List.Item>Industrial and Manufacturing firms upgrading to Industry 4.0.</List.Item>
              <List.Item>Startups requiring rapid prototyping and feasibility studies.</List.Item>
            </List>
          </Paper>

          <Paper withBorder p="xl" radius="lg" shadow="sm">
            <Group mb="md">
              <ThemeIcon size={40} color="indigo"><IconRoute size={22} /></ThemeIcon>
              <Title order={3}>Engagement Workflow</Title>
            </Group>
            <List spacing="sm" size="sm" icon={<IconClock size={16} color="indigo"/>}>
              <List.Item><b>Discovery Call:</b> Free 30-min session to assess your needs.</List.Item>
              <List.Item><b>Technical Assessment:</b> Deep dive into requirements and current stack.</List.Item>
              <List.Item><b>Action Plan:</b> Shared document outlining roadmap and milestones.</List.Item>
              <List.Item><b>Execution:</b> Live pair-programming, code audits, or remote consulting.</List.Item>
            </List>
          </Paper>

        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            
            {/* COLONNA 1: BUSINESS HOURS */}
            <Paper withBorder p="xl" radius="lg" shadow="sm">
              <Group mb="lg">
                <ThemeIcon color="blue" size={40} radius="md"><IconClock size={24} /></ThemeIcon>
                <Title order={3}>Availability</Title>
              </Group>

              <Text fw={700} size="sm" mb="xs">Business Hours</Text>
              <Stack gap="sm" mb="xl">
                <Group>
                  <IconCalendar size={18} color="gray" />
                  <Text size="sm"><b>Mon - Fri:</b> 09:00 AM – 06:00 PM (CET)</Text>
                </Group>
                <Group>
                  <IconInfoCircle size={18} color="gray" />
                  <Text size="sm" c="dimmed">Closed on weekends and public holidays.</Text>
                </Group>
              </Stack>
              
              <Divider my="md" />
              
              <Text size="xs" c="dimmed" fs="italic">
                * All requests received outside of business hours will be processed on the following working day.
              </Text>
            </Paper>

            {/* COLONNA 2: HOW TO REACH ME */}
            <Paper withBorder p="xl" radius="lg" shadow="sm">
              <Group mb="lg">
                <ThemeIcon color="teal" size={40} radius="md"><IconBrandTelegram size={24} /></ThemeIcon>
                <Title order={3}>How to reach me</Title>
              </Group>
              
              {/* SEZIONE 1: CANALI DIRETTI */}
              <Text fw={700} size="sm" mb="xs">Direct Contact</Text>
              <Text size="sm" c="dimmed" mb="md">
                For quick questions or informal inquiries, reach out directly:
              </Text>
              <List spacing="sm" size="sm" center mb="xl">
                <List.Item icon={<IconAt size={18} />}><b>Email:</b> giuseppe.pedone@email.com</List.Item>
                <List.Item icon={<IconBrandTelegram size={18} />}><b>Telegram:</b> @giuseppe_pedone_dev</List.Item>
              </List>

              <Divider my="lg" label="OR" labelPosition="center" />

              {/* SEZIONE 2: PRENOTAZIONE FORMALE */}
              <Text fw={700} size="sm" mb="xs">Formal Consultation</Text>
              <Text size="sm" c="dimmed" mb="md">
                For a structured deep-dive or project planning, please book via the platform:
              </Text>
              
              <Button 
                variant="filled" 
                color="blue" 
                fullWidth 
                component="a" 
                href="#booking-section"
                leftSection={<IconClock size={16} />}
              >
                Book a Formal Session
              </Button>
            </Paper>

        </SimpleGrid>
      </Container>
    </section>
  );
}















export function ConsultingProcessSection() {
  
  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#f8f9fa' }}>
      <Container size="xl">
        <Title order={2} ta="center" mb={50}>Consulting Process Flow</Title>
        <Text ta="center" c="dimmed" mb={60} size="lg">Navigate the Activity Graph, that shows for each deliverable you will select, a complete roadmap from the first call to the final deliverable.</Text>
        <br/>
        <ConsultingActivitiyGraph/>
      </Container>
    </section>
  );
}






export function AvailabilitySection({ onSlotSelect }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);

      const start = format(currentWeekStart, 'yyyy-MM-dd');
      const end = format(addDays(currentWeekStart, 7), 'yyyy-MM-dd');

      try {
        

        const params = new URLSearchParams({ start, end });
        const res = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/availability?${params.toString()}`);


        const json = await res.json();
        setAvailabilityData(json.slots || []);
      } catch (err) {
        console.error("Error fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [currentWeekStart]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)), [currentWeekStart]);
  
  // Orari fissi (puoi renderli dinamici o tenerli fissi per coerenza visiva)
  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  console.log("Dati ricevuti da /availability:", availabilityData);


  return (
    <section className="section-box">
      <Title order={2} ta="center" mb={50}>Business Hours & Consulting Schedules</Title>
      {/* ORARI E GIORNI */}
      <Card withBorder radius="xl" p="xl" shadow="sm">
        <Group mb="md">
          <ThemeIcon color="blue" size={40} radius="md"><IconClock size={24} /></ThemeIcon>
          <Text fw={700} fz="lg">Business Hours</Text>
        </Group>
        
        <Stack gap="md">
          <Group>
            <IconCalendar size={20} color="gray" />
            <Text><b>Days:</b> Monday to Friday</Text>
          </Group>
          <Group>
            <IconClock size={20} color="gray" />
            <Text><b>Time:</b> 09:00 AM – 06:00 PM (CET)</Text>
          </Group>
          <Divider />
          <Text size="sm" c="dimmed">
            <IconInfoCircle size={14} style={{ marginRight: 5 }} />
            Unavailable on weekends and public holidays. All requests received outside these hours will be processed on the next business day.
          </Text>
        </Stack>
      </Card>
      <br/>
      <br/>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={800}>Weekly Schedule</Text>
        <Group gap="xs" style={{ opacity: loading ? 0.5 : 1 }}>
          <ActionIcon size="lg" variant="default" disabled={loading} onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}><IconChevronLeft /></ActionIcon>
          <Badge size="lg" variant="outline">{format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d')}</Badge>
          <ActionIcon size="lg" variant="default" onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}><IconChevronRight /></ActionIcon>
        </Group>
      </Group>

      <SimpleGrid cols={8} spacing="xs" style={{ alignItems: 'flex-start' }}>
        <Stack gap="xs" pt={50}>
          {timeSlots.map(time => <Text key={time} ta="right" size="sm" c="dimmed" fw={600} h={60} pt={20}>{time}</Text>)}
        </Stack>

        {weekDays.map(day => (
          <Stack key={day} gap="xs">
            <Paper className="header-paper" p="xs" ta="center" withBorder radius="md" bg={isToday(day) ? 'blue.0' : undefined}>
              <Text size="xs" tt="uppercase" c="dimmed">{format(day, 'EEE')}</Text>
              <Text fw={700} size="lg">{format(day, 'dd')}</Text>
            </Paper>


            {timeSlots.map(time => {
              // 1. Estrai l'ora dal tuo array (es. "11:00" -> 11)
              const targetHour = parseInt(time.split(':')[0], 10);

              // 2. Cerca lo slot confrontando l'ora LOCALE del browser
              const slot = availabilityData.find(s => {
                // new Date() converte automaticamente la stringa UTC in ora italiana
                const d = new Date(s.start); 
                
                // getHours() restituisce l'ora nel fuso orario del PC (es. 09:00 UTC -> 11:00 locale)
                return isSameDay(d, day) && d.getHours() === targetHour;
              });

              const isAvailable = !!slot;

              return (
                <Box key={time} style={{ height: '60px', position: 'relative' }}>
                  <Box 
                    className={`slot-card ${isAvailable ? 'available' : 'unavailable'}`}
                    onClick={() => isAvailable && onSlotSelect(slot)}
                  >
                    {isAvailable ? (
                      <>
                        <IconCalendarEvent size={20} className="status-icon" />
                        <div className="hover-content">
                          <IconBook size={20} />
                          <Text size="xs" fw={700}>BOOK IT</Text>
                        </div>
                      </>
                    ) : (
                      <div className="unavailable-content">
                        <IconX size={16} stroke={3} />
                      </div>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        ))}
      </SimpleGrid>

      <style>{`
       /* Header dei giorni: Look più pulito e "floating" */
        .header-paper {
          transition: all 0.3s ease;
          border-bottom: 2px solid var(--mantine-color-blue-2);
          background-color: var(--mantine-color-white);
        }
        .header-paper:hover {
          transform: translateY(-2px);
          box-shadow: var(--mantine-shadow-sm);
        }

        /* Stile base slot */
        .slot-card { 
          height: 52px; width: 100%; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
          margin-bottom: 8px;
          border: 1px solid transparent;
        }

        /* Slot Occupato: Feedback visivo di "Chiuso" */
        .slot-card.unavailable { 
          background-color: var(--mantine-color-gray-0); 
          border: 1px solid var(--mantine-color-gray-2);
          color: var(--mantine-color-gray-4); 
          cursor: not-allowed;
          position: relative;
          /* Pattern a righe diagonali per dare l'idea di "area non disponibile" */
          background-image: repeating-linear-gradient(
            45deg,
            var(--mantine-color-gray-0),
            var(--mantine-color-gray-0) 10px,
            var(--mantine-color-gray-1) 10px,
            var(--mantine-color-gray-1) 20px
          );
        }

        /* Icona X centrata e ben visibile */
        .unavailable-content {
          opacity: 0.5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Effetto al passaggio del mouse sugli slot occupati (opzionale) */
        .slot-card.unavailable:hover {
          background-color: var(--mantine-color-gray-1);
          border-color: var(--mantine-color-gray-3);
        }

        /* Stile Slot Disponibile: Moderno ed Energetico */
        .slot-card.available { 
          background-color: var(--mantine-color-blue-0); 
          border: 1px solid var(--mantine-color-blue-3);
          color: var(--mantine-color-blue-7);
        }
        .slot-card.available:hover { 
          background-color: var(--mantine-color-blue-6); 
          color: var(--mantine-color-white); 
          transform: scale(1.05); 
          box-shadow: 0 8px 16px -4px rgba(33, 154, 240, 0.4);
          z-index: 10;
        }

        /* Gestione icone */
        .hover-content { 
          display: none; 
          flex-direction: column; 
          align-items: center; 
          gap: 2px; 
          font-weight: 700;
        }

        .slot-card.available:hover .status-icon { display: none; }
        .slot-card.available:hover .hover-content { display: flex; }
      `}</style>
    </section>
  );
}



export function PricingSection({ onSlotSelect, onDurationSelect }) {
  const services = Object.entries(buisness_service_info);

  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#f8f9fa' }}>
      <Container size="xl">
        <Title order={2} ta="center" mb={50}>Consulting & Development Pricing Services</Title>

        {/* 1. SEZIONE SERVIZI E PREZZI (Mantiene la griglia originale con elementi espandibili) */}
        <Paper withBorder radius="xl" p="xl" shadow="sm" bg="white" mb={60}>
          <Text fw={700} fz="xl" mb="xs">Professional Service Rates</Text>
          <Text size="sm" c="dimmed" mb="xl">
            Hourly rates are determined solely by the specific technical and engineering tasks required. Click on each service to view its included deliverables.
          </Text>
          
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
            {services.map(([name, data]) => (
              <ServiceGridCard key={name} name={name} data={data} />
            ))}
          </SimpleGrid>
        </Paper>

        {/* 2. SEZIONE BOOKING CALLS (Semplificata, non categorizzata, descrittiva) */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb={60}>
          <Card withBorder radius="xl" p="xl" shadow="sm">
            <Group gap="xs" mb="sm">
              <IconPhoneCall size={22} color="var(--mantine-color-blue-6)" />
              <Text fw={700} fz="lg">Book an On-Demand Call</Text>
            </Group>
            
            <Text size="sm" c="dimmed" mb="xl">
              Calls can be booked at any time to support you in the following areas:
              <br />
              • <b>Discovery Call:</b> for initial alignment, context gathering, and requirement definition.
              <br />
              • <b>Pattern Choice Call:</b> to analyze alternative scenarios and make architectural or budgetary decisions.
              <br />
              • <b>Delivery Call:</b> for validation walkthroughs, code reviews, or resolving operational bottlenecks.
            </Text>

            <Stack gap="sm">
              <Button size="md" variant="light" color="blue" onClick={() => onDurationSelect('30min')}>
                Book for {durations[0]} for free
              </Button>
              <Button size="md" variant="light" color="blue" onClick={() => onDurationSelect('1h')}>
                Book for {durations[1]} at €{price_per_slot[1]}
              </Button>
              <Button size="md" variant="outline" color="blue" onClick={() => onDurationSelect('2h')}>
                Book for {durations[2]} at €{price_per_slot[2]}
              </Button>
            </Stack>
          </Card>

          {/* POLICIES */}
          <Card withBorder radius="xl" p="xl" shadow="sm">
            <Group mb="md">
              <IconShieldCheck color="teal" /> 
              <Text fw={700} fz="lg">Service & Billing Policies</Text>
            </Group>
            <List size="sm" spacing="sm" icon={<Text size="xs" c="teal" fw={700}>✓</Text>}>
              {payment_info.note.map((n, i) => (
                <List.Item key={i}>{n}</List.Item>
              ))}
            </List>
          </Card>
        </SimpleGrid>

        {/* 3. SEZIONE PAGAMENTI (I tuoi helper riutilizzati) */}
        <Paper withBorder p="xl" radius="xl" shadow="sm" bg="white">
          <Text fw={700} fz="lg" mb="md">Payment Gateway Selector</Text>
          <Tabs defaultValue="stripe">
            <Tabs.List mb="lg">
              <Tabs.Tab value="stripe" leftSection={<IconCreditCard size={16} />}>Stripe (Instant)</Tabs.Tab>
              <Tabs.Tab value="paypal" leftSection={<IconBrandPaypal size={16} />}>PayPal</Tabs.Tab>
              <Tabs.Tab value="bank" leftSection={<IconBuildingBank size={16} />}>Bank Transfer</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="stripe">
              <Button color="blue" size="md" leftSection={<IconCreditCard size={18} />}>Proceed to Secure Payment</Button>
            </Tabs.Panel>
            
            <Tabs.Panel value="paypal">
              <PaymentDetailCard title="PayPal" detail="giuseppe.pedone@email.com" link="https://paypal.me/giuseppe" />
            </Tabs.Panel>

            <Tabs.Panel value="bank">
              <BankDetailCard beneficiary="Giuseppe Pedone" iban="IT00 0000 0000 0000 0000 0000 000" />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Container>
    </section>
  );
}

{/* Sotto-componente per gestire l'espansione indipendente di ogni card mantenendo intatta la griglia */}
function ServiceGridCard({ name, data }) {
  const [opened, setOpened] = useState(false);

  return (
    <Card 
      withBorder 
      radius="lg" 
      p="md" 
      bg="blue.0"
      style={{ 
        cursor: 'pointer', 
        transition: 'all 0.2s ease',
        alignSelf: 'start' // Evita che le card cambino altezza in modo sbilanciato nella griglia
      }}
      onClick={() => setOpened((o) => !o)}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={700} fz="sm">{name}</Text>
        <Group gap={6}>
          <Badge color="blue" size="md" variant="filled">€{data.hourlyRate}/h</Badge>
          {opened ? <IconChevronUp size={16} color="gray" /> : <IconChevronDown size={16} color="gray" />}
        </Group>
      </Group>
      
      <Text size="xs" c="dimmed" mb={opened ? 'md' : 0}>
        {data.description}
      </Text>

      <Collapse in={opened}>
        <Divider my="xs" />
        <Text size="xs" fw={700} mb={6} c="blue.8">Included Deliverables:</Text>
        <Stack gap={4}>
          {Object.values(data.deliverables).map((item, i) => (
            <Badge 
              key={i} 
              variant="white" 
              size="xs" 
              color="gray" 
              ta="left" 
              fullWidth
              style={{ 
                whiteSpace: 'normal', 
                height: 'auto', 
                padding: '6px 8px', 
                border: '1px solid #e9ecef',
                justifyContent: 'flex-start'
              }}
            >
              • {item}
            </Badge>
          ))}
        </Stack>
      </Collapse>
    </Card>
  );
}

{/* I TUOI COMPONENTI HELPER RIPRISTINATI E OTTIMIZZATI */}
function PaymentDetailCard({ title, detail, link }) {
  return (
    <Card withBorder radius="md" p="md" style={{ maxWidth: '400px' }}>
      <Text fw={700}>{title}</Text>
      <Text size="sm" c="dimmed" mb="sm">{detail}</Text>
      <Button variant="subtle" size="xs" component="a" href={link} target="_blank" rightSection={<IconChevronRight size={14}/>}>
        Go to Payment
      </Button>
    </Card>
  );
}

function BankDetailCard({ beneficiary, iban }) {
  return (
    <Card withBorder radius="md" p="md" bg="blue.0" style={{ maxWidth: '500px' }}>
      <Stack gap="xs">
        <BankField label="Beneficiary" value={beneficiary} />
        <BankField label="IBAN" value={iban} />
      </Stack>
    </Card>
  );
}

function BankField({ label, value }) {
  return (
    <Group justify="space-between" p={8} bg="white" style={{ borderRadius: 6, border: '1px solid #e9ecef' }}>
      <Stack gap={0}>
        <Text size="xs" fw={700} c="dimmed">{label}</Text>
        <Text size="sm" style={{ fontFamily: 'monospace' }}>{value}</Text>
      </Stack>
      <CopyButton value={value}>
        {({ copied, copy }) => (
          <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy} variant="subtle">
            <IconCopy size={16} />
          </ActionIcon>
        )}
      </CopyButton>
    </Group>
  );
}


const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function ResourcesSection({ lessonsTree }) {
  const [catSearchQuery, setCatSearchQuery] = useState('');     // Per la sezione Categorie
    const [downloadSearchQuery, setDownloadSearchQuery] = useState(''); // Per la sezione Download
    const [selectedPaths, setSelectedPaths] = useState(new Set());
    
    
    const [activeCategoryFilters, setActiveCategoryFilters] = useState([]);
    const [openedCategories, setOpenedCategories] = useState({});
    const categoryIcons = {
      'GUIDES': <IconBook size={20} />,
      'HOW-TO': <IconHelp size={20} />,
      'MANUALS': <IconFileText size={20} />,
      'CODE-SNIPPETS': <IconCode size={20} />,
      'SCRIPTS': <IconTerminal size={20} />,
      'EXAMPLES': <IconBox size={20} />,
      'REFERENCES': <IconBookmark size={20} />,
      'KNOWLEDGE': <IconBulb size={20} />,
      'DEFAULT': <IconFolder size={20} />
    };
  
    const toggleSelection = useCallback((item, isSelected) => {
      setSelectedPaths(prev => {
        // 1. Crea un nuovo Set basato sul precedente
        const next = new Set(prev);
        
        // 2. Logica: se è una cartella, ricorsione; se è un file, aggiungi/rimuovi
        const walk = (n) => {
          if (n.type === 'file') {
            isSelected ? next.add(n.path) : next.delete(n.path);
          } else if (n.children) {
            n.children.forEach(walk);
          }
        };
        
        walk(item);
        return next; // 3. Ritorna il nuovo riferimento: React farà il re-render
      });
    }, []);
  
    const [openedSubjects, setOpenedSubjects] = useState({});
  
    const toggleSubject = (subjectName) => {
      setOpenedSubjects(prev => ({
        ...prev,
        [subjectName]: !prev[subjectName]
      }));
    };
  
    
   
    const toggleCategory = (catName) => {
      setOpenedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
    };
  
    const toggleCategoryFilter = (catName) => {
      setActiveCategoryFilters(prev => 
        prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
      );
    };
  
    // Calcolo delle risorse per categoria
    const crossCategoryResources = useMemo(() => {
      const targetCategories = ['KNOWLEDGE', 'GUIDES', 'HOW-TO', 'MANUALS', 'CODE-SNIPPETS', 'SCRIPTS', 'EXAMPLES', 'APPLICATIONS', 'PROJECTS', 'TUTORIALS', 'REFERENCES', 'MULTIMEDIA'];
      const result = {};
      const traverse = (node, subject, pathArr = []) => {
        if (node.type === 'folder' && targetCategories.includes(node.name.toUpperCase())) {
          const catName = node.name.toUpperCase();
          if (!result[catName]) result[catName] = [];
          node.children?.forEach(child => {
            result[catName].push({ ...child, subject, pathInfo: [...pathArr, node.name].join(' > ') });
          });
        }
        node.children?.forEach(child => traverse(child, subject, [...pathArr, node.name]));
      };
      lessonsTree?.children?.forEach(s => traverse(s, s.name, [s.name]));
      return result;
    }, [lessonsTree]);
  
    // Logica di filtraggio avanzato (Filtri + Ricerca)
    const filteredCategories = useMemo(() => {
      const query = catSearchQuery.toLowerCase();
      return Object.entries(crossCategoryResources)
        .filter(([catName, items]) => {
          const matchesCategory = activeCategoryFilters.length === 0 || activeCategoryFilters.includes(catName);
          const matchesText = query === '' || catName.toLowerCase().includes(query) || items.some(i => i.name.toLowerCase().includes(query));
          return matchesCategory && matchesText;
        })
        .map(([catName, items]) => {
          const filteredItems = query ? items.filter(i => i.name.toLowerCase().includes(query)) : items;
          const totalSize = filteredItems.reduce((acc, curr) => acc + (curr.size || 0), 0);
          const extensions = Array.from(new Set(filteredItems.map(i => i.name.split('.').pop().toLowerCase())));
          return { catName, items: filteredItems, totalSize, extensions };
        });
    }, [crossCategoryResources, catSearchQuery, activeCategoryFilters]);
  
  
  
  
    const processedTree = useMemo(() => {
      if (!lessonsTree) return null;
  
      const decorate = (node) => {
        // 1. Calcola le stats (il lavoro pesante avviene qui una sola volta)
        const stats = getFolderStats(node); 
        
        // 2. Crea un nuovo oggetto con le stats incluse
        const decorated = { ...node, stats };
        
        // 3. Decora ricorsivamente i figli
        if (node.children) {
          decorated.children = node.children.map(decorate);
        }
        return decorated;
      };
      
      return { 
        ...lessonsTree, 
        children: lessonsTree.children?.map(decorate) 
      };
    }, [lessonsTree]);
  
  
    useEffect(() => {
      // Se c'è una ricerca attiva, apriamo tutte le categorie che hanno risultati
      if (catSearchQuery.length > 0) {
        const newOpenedState = {};
        filteredCategories.forEach(cat => {
          newOpenedState[cat.catName] = true; // Forza l'apertura
        });
        setOpenedCategories(newOpenedState);
      } else {
        // Se la ricerca è vuota, chiudiamo tutto (o resetta come preferisci)
        setOpenedCategories({});
      }
    }, [filteredCategories, catSearchQuery]);
  
  
  
  
    const CompactFileRow = ({ file, selectedPaths = new Set(), onToggle }) => {
      const isChecked = selectedPaths.has(file.path);
  
      return (
        <Box 
          p="xs" 
          mb="xs"
          style={{ 
            border: '1px solid #f1f3f5',
            borderRadius: '8px',
            backgroundColor: '#fff'
          }}
        >
          {/* RIGA 1: Nome file e Azioni */}
          <Group justify="space-between" mb={4} wrap="nowrap">
            <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
              <Checkbox 
                  size="xs" 
                  // Usiamo il valore calcolato
                  checked={isChecked} 
                  onChange={(e) => {
                    // Chiamiamo la funzione passata dal padre
                    onToggle(file, e.currentTarget.checked);
                  }} 
                />
              <Badge size="xs" variant="filled" color="blue" w={50}>{file.name.split('.').pop().toUpperCase()}</Badge>
              <Text fw={600} size="sm" truncate>{file.name}</Text>
            </Group>
            
            <ActionPanel item={file} type="file" />
          </Group>
  
          {/* RIGA 2: Percorso e Dimensione */}
          <Group justify="space-between" mt={4}>
            <Text size="xs" c="dimmed" truncate style={{ flex: 1 }}>
              <IconFolder size={12} style={{ marginRight: 4 }} />
              {file.topicPath}
            </Text>
            <Badge size="xs" variant="light" color="gray">
              {formatSize(file.size)}
            </Badge>
          </Group>
        </Box>
      );
    };
  
  
    // Logica di ricerca flatMap aggiornata
    const allFiles = useMemo(() => {
      let files = [];
      const traverse = (node, subject, pathArr = []) => {
        if (node.type === 'file') {
          files.push({ ...node, subject, topicPath: pathArr.join(' > ') });
        } else if (node.children) {
          node.children.forEach(child => traverse(child, subject, [...pathArr, node.name]));
        }
      };
      lessonsTree?.children?.forEach(s => traverse(s, s.name));
      return files;
    }, [lessonsTree]);
  
    const groupedResults = useMemo(() => {
      if (!downloadSearchQuery) return {};
      return allFiles
        .filter(f => f.name.toLowerCase().includes(downloadSearchQuery.toLowerCase()))
        .reduce((acc, file) => {
          const ext = file.name.split('.').pop().toUpperCase();
          if (!acc[ext]) acc[ext] = [];
          acc[ext].push(file);
          return acc;
        }, {});
    }, [downloadSearchQuery, allFiles]);
  
    return (
      <section style={{ padding: '20px 0', maxWidth: '1000px', margin: '0 auto' }}>
  
  
        <Paper withBorder p="xl" radius="md" mb="xl">
          <Title order={2} mb="xs">
                <IconSearch size={28} style={{ verticalAlign: 'middle', marginRight: 10 }} />
                Explore, Search and Download different free Resources 
          </Title>
          <Stack gap="md">
            <TextInput
              placeholder="Search materials based on categories..."
              size="lg" radius="md" leftSection={<IconSearch size={20} />}
              value={catSearchQuery} onChange={(e) => setCatSearchQuery(e.target.value.trimStart())}
            />
            <Group gap="xs">
              <Text size="sm" c="dimmed">filter by:</Text>
              {Object.keys(crossCategoryResources).map(cat => (
                <Chip key={cat} checked={activeCategoryFilters.includes(cat)} onChange={() => toggleCategoryFilter(cat)} size="xs">
                  {cat}
                </Chip>
              ))}
            </Group>
          </Stack>
        </Paper>
  
        {/* Main Categories Display */}
        <Stack gap="md">
          {filteredCategories.map(({ catName, items, totalSize, extensions }) => {
            const Icon = categoryIcons[catName] || categoryIcons['DEFAULT'];
            return (
              <Box key={catName} style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden' }}>
                <Group p="md" onClick={() => toggleCategory(catName)} style={{ cursor: 'pointer' }} justify="space-between">
                  <Group>
                    <Box c="blue">{Icon}</Box>
                    <Stack gap={0}>
                      <Title order={4} tt="uppercase">{catName}</Title>
                      <Group gap="xs">
                        <Badge variant="light" size="sm">{items.length} items</Badge>
                        <Text size="xs" c="dimmed">{formatSize(totalSize)}</Text>
                        {extensions.slice(0, 3).map(ext => <Badge key={ext} size="xs" variant="outline">{ext.toUpperCase()}</Badge>)}
                      </Group>
                    </Stack>
                  </Group>
                  <IconChevronRight size={16} style={{ transform: openedCategories[catName] ? 'rotate(90deg)' : 'none' }} />
                </Group>
                
                <Collapse in={openedCategories[catName]}>
                  <Box p="md" style={{ borderTop: '1px solid #eee' }}>
                    <Stack gap={5}>
                      {items.map(item => (
                        item.type === 'folder' 
                          ? <DirectoryNode key={item.path} node={item} selectedPaths={selectedPaths} onToggle={toggleSelection} />
                          : <FileItem key={item.path} file={item} subject={item.subject} topic={item.pathInfo} selectedPaths={selectedPaths} onToggle={toggleSelection} />
                      ))}
                    </Stack>
                  </Box>
                </Collapse>
            </Box>
            );
          })}
        </Stack>
        
        <br/>
        <br/>
        <Paper withBorder p="xl" radius="md" shadow="sm" bg="var(--mantine-color-gray-0)">
          <Stack gap="md">
            {/* Header della sezione */}
            <Box>
              <Title order={2} mb="xs">
                <IconDownload size={28} style={{ verticalAlign: 'middle', marginRight: 10 }} />
                Search and Download files
              </Title>
              <Text c="dimmed" size="sm">
                Find istantly your resources and download them through this platform.
              </Text>
            </Box>
  
            {/* Input di Ricerca */}
            <TextInput
              placeholder="Search all files..."
              size="lg" 
              radius="md" 
              leftSection={<IconSearch size={20} />}
              value={downloadSearchQuery} 
              onChange={(e) => setDownloadSearchQuery(e.target.value.trimStart())}
              styles={{ input: { backgroundColor: '#fff', border: '1px solid #dee2e6' } }}
            />
  
            <br/>
  
            {/* Area Risultati (Condizionale) */}
            <Collapse in={!!downloadSearchQuery}>
              <Paper withBorder p="xl" radius="md" shadow="lg" bg="white" mt="md">
                <Group gap="xs" mb="xs">
                  <ThemeIcon variant="light" color="blue" size="md" radius="sm">
                    <IconSearch size={18} />
                  </ThemeIcon>
                  <Title order={3} fw={600}>
                    Results for <Text span c="blue" inherit>"{downloadSearchQuery}"</Text>
                  </Title>
                </Group>
  
                {/* 1. VISUALE RAPIDA: Tutti i risultati unificati */}
                <Box mb="xl">
                  <Text fw={600} mb="xs" size="sm" c="dimmed" tt="uppercase">View Results (All files)</Text>
                  <Stack gap={2}>
                    {allFiles
                      .filter(f => f.name.toLowerCase().includes(downloadSearchQuery.toLowerCase()))
                      .slice(0, 5) // Mostra solo i primi 5 per rapidità
                      .map(f => (
                        <CompactFileRow key={f.path} file={f} selectedPaths={selectedPaths} onToggle={toggleSelection}/>
                      ))}
                  </Stack>
                </Box>
                
                <Box mb="xl">
                  <Text fw={600} mb="xs" size="sm" c="dimmed" tt="uppercase">All files by category</Text>
                   <Stack gap="lg">
                    {Object.entries(groupedResults).map(([ext, files]) => (
                      <Box key={ext}>
                        <Badge size="md" mb="xs" color="blue" variant="light">
                          {ext} Files ({files.length})
                        </Badge>
                        <Stack gap={2}>
                          {files.map(f => (
                            <CompactFileRow key={f.path} file={f} selectedPaths={selectedPaths} onToggle={toggleSelection}/>
                          ))}
                        </Stack>
                      </Box>
                    ))} 
                  </Stack>
                </Box>
                {/* 2. CATEGORIZZAZIONE DETTAGLIATA (Come volevi) */}
               
              </Paper>
            </Collapse>
          </Stack>
        </Paper>
  
  
        {/* Pulsante Download */}
        <Affix position={{ bottom: 30, right: 30 }}>
          <Transition transition="slide-up" mounted={selectedPaths.size > 0}>
            {(styles) => (
              <Button style={styles} size="lg" radius="xl" color="blue" shadow="xl" leftSection={<IconDownload size={20} />}
                onClick={() => alert(`Download ${selectedPaths.size} file!`)}>
                Download {selectedPaths.size} {selectedPaths.size === 1 ? 'file' : 'files'}
              </Button>
            )}
          </Transition>
        </Affix>
      </section>
    );
  }
  



const ActionPanel = ({ item, type }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + item.path);
  };

  return (
    <Group gap={4}>
      <ActionIcon variant="subtle" color="gray" title="Copy Link" onClick={handleCopy}>
        <IconLink size={16} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="blue" title="Download Raw" onClick={() => console.log('Raw:', item.path)}>
        <IconDownload size={16} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="green" title="Download ZIP" onClick={() => console.log('ZIP:', item.path)}>
        <IconFileZip size={16} />
      </ActionIcon>
    </Group>
  );
};


const getStatsForNode = (node) => {
  // Se è un file, le sue stats sono fisse
  if (node.type === 'file') {
    return {
      count: 1,
      sizeBytes: node.size || 0,
      extensions: [node.name.split('.').pop().toLowerCase()]
    };
  }

  // Se è una cartella, aggrega i dati dei figli diretti
  if (node.children) {
    const childrenStats = node.children.map(child => getStatsForNode(child));
    
    return {
      count: childrenStats.reduce((acc, s) => acc + s.count, 0),
      sizeBytes: childrenStats.reduce((acc, s) => acc + s.sizeBytes, 0),
      extensions: Array.from(new Set(childrenStats.flatMap(s => s.extensions)))
    };
  }

  return { count: 0, sizeBytes: 0, extensions: [] };
};


const DirectoryNode = React.memo(({ node, selectedPaths, onToggle }) => {
  const [open, setOpen] = useState(false);
  const stats = useMemo(() => getStatsForNode(node), [node]);
  useEffect(() => {
    if (node.forceOpen) setOpen(true);
  }, [node.forceOpen]);

  return (
    <Box>
      <Group p="xs" justify="space-between">
        <Group 
          style={{ cursor: 'pointer', flex: 1 }} 
          onClick={() => setOpen(!open)}
        >
          <Checkbox 
            checked={!!selectedPaths?.has(node.path)} 
            onChange={(e) => onToggle(node, e.currentTarget.checked)}
            onClick={(e) => e.stopPropagation()} 
          />
          <Box>
            <Text size="sm">{node.name}</Text>
            <Text size="xs" c="dimmed">
              {stats.count} file • {formatSize(stats.sizeBytes)}
            </Text>
          </Box>
        </Group>

        
        <ActionPanel item={node} type="folder" />
      </Group>

      <Collapse in={open}>
        <Stack pl="lg">
          {open && node.children?.map(child => (
            child.type === 'folder' 
              ? <DirectoryNode 
                  key={child.path} 
                  node={child} 
                  selectedPaths={selectedPaths} 
                  onToggle={onToggle} 
                />
              : <FileItem 
                  key={child.path} 
                  file={child} 
                  selectedPaths={selectedPaths} 
                  onToggle={onToggle} 
                />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
});

const FileItem = React.memo(({ file, selectedPaths, onToggle }) => {
  return (
    <Group p="xs" justify="space-between">
      <Group p="xs">
        <Checkbox checked={!!selectedPaths?.has(file.path)} onChange={(e) => onToggle(file, e.currentTarget.checked)} />
        <Text size="sm">{file.name}</Text>
        
        <Badge size="xs">{formatSize(file.size)}</Badge>
      </Group>
      <ActionPanel item={file} type="file" />
    </Group>
  );
});


/*
=====================================================
AUTO DIRECTORY TREE GENERATION
=====================================================

Create generate-tree.js

-----------------------------------------------------

import fs from 'fs';
import path from 'path';

function buildTree(dirPath) {
  const stats = fs.statSync(dirPath);

  if (stats.isFile()) {
    return {
      name: path.basename(dirPath),
      type: 'file',
      path: dirPath.replace('public', ''),
    };
  }

  return {
    name: path.basename(dirPath),
    type: 'folder',
    children: fs
      .readdirSync(dirPath)
      .map(child => buildTree(path.join(dirPath, child))),
  };
}

const tree = buildTree('./public/lessons');

fs.writeFileSync(
  './src/data/lessons-tree.json',
  JSON.stringify(tree, null, 2)
);

-----------------------------------------------------

Then import JSON dynamically:

import lessonsTree from '../data/lessons-tree.json';

=====================================================
GITHUB PAGES SUPPORT
=====================================================

This component works perfectly on GitHub Pages because:

- all assets are static
- materials are downloadable
- no backend required
- tree generated at build time

=====================================================
CAL.COM API INTEGRATION
=====================================================

The Lessons page is designed to integrate directly with Cal.com APIs.

GOALS:

- allow students to book lessons
- choose:
  - subject
  - topic
  - duration
  - date
  - time slot
- automatically sync availability
- automatically mark busy slots
- allow real-time scheduling
- receive booking notifications
- optionally populate external files/databases

=====================================================
SUGGESTED FLOW
=====================================================

Student opens Lessons page
        ↓
Chooses:

- Subject
- Topic
- Duration
- Time slot

        ↓
Lessons page calls Cal.com API
        ↓
Cal.com checks availability
        ↓
Available slots shown on calendar
        ↓
Student books lesson
        ↓
Cal.com:

- sends notification
- updates Google Calendar
- blocks occupied slots
- optionally triggers webhook

=====================================================
RECOMMENDED CAL.COM FEATURES
=====================================================

- Event Types
- API Routing Forms
- Availability API
- Bookings API
- Webhooks
- Google Calendar Sync
- Outlook Sync
- Zoom / Meet Integration

=====================================================
CALENDAR SYNCHRONIZATION
=====================================================

The availability section should:

1. fetch free/busy slots from Cal.com
2. render them dynamically
3. disable occupied slots
4. update automatically

=====================================================
EXAMPLE API FLOW
=====================================================

GET availability:

fetch('/api/cal/availability')

POST booking:

fetch('/api/cal/book', {
  method: 'POST',
  body: JSON.stringify({
    subject,
    topic,
    date,
    duration,
    student,
  })
})

=====================================================
WEBHOOKS
=====================================================

Recommended:

Cal.com → Webhook → Your backend

Possible actions:

- save booking in JSON
- save booking in database
- send email
- notify Telegram bot
- generate lesson ID
- attach materials
- generate invoice

=====================================================
DIRECTORY TREE STRUCTURE
=====================================================

The page is filesystem-driven.

You provide:

Materials/
└── Subject/
    └── Topic/
        ├── Material/
        │   ├── Tutorials/
        │   ├── Examples/
        │   ├── Projects/
        │   ├── Scripts/
        │   └── Guides/
        │
        └── License/
            └── LICENSE.md

The React component dynamically renders:

- subjects
- topics
- materials
- downloadable files
- licenses

WITHOUT hardcoding folder names.

=====================================================
DIRECTORY TREE FEATURES
=====================================================

The materials explorer supports:

- collapsible folders
- nested navigation
- recursive rendering
- file downloads
- modern explorer UI
- unlimited depth
- automatic updates
- GitHub Pages compatibility

=====================================================
AUTO TREE GENERATION
=====================================================

Filesystem changes:

- add folder
- rename folder
- delete file
- add topic
- add material

ONLY require regenerating:

lessons-tree.json

No React code modifications needed.

=====================================================
AVAILABILITY CALENDAR
=====================================================

The calendar section is designed to:

- display available slots
- display busy slots
- synchronize with Cal.com
- synchronize with Google Calendar
- update in real-time
- disable unavailable slots
- allow direct booking

=====================================================
BOOKING SECTION IMPROVEMENTS
=====================================================

Recommended future UI:

- embedded Cal.com widget
- subject selector
- topic selector
- lesson type selector
- duration selector
- real calendar grid
- timezone support
- recurring lessons
- package booking
- payment integration
- Stripe checkout

=====================================================
GITHUB PAGES SUPPORT
=====================================================

This architecture works on GitHub Pages because:

- lessons/materials are static
- directory tree is pre-generated
- React only renders JSON
- downloadable files are public assets

Dynamic features are delegated to:

- Cal.com APIs
- serverless functions
- webhooks

=====================================================
RECOMMENDED ARCHITECTURE
=====================================================

React Frontend
        ↓
Lessons Explorer
        ↓
Cal.com APIs
        ↓
Availability + Booking
        ↓
Webhook / Serverless Backend
        ↓
Notifications + Storage

=====================================================
ROUTING EXAMPLE
=====================================================

<Route path="/activities" element={<Activities />} />
<Route path="/activities/lessons" element={<Lessons />} />

=====================================================
*/

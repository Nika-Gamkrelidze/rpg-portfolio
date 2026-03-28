export interface TalentNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  tree: "frontend" | "backend" | "sql" | "voip" | "shared";
  sharedTrees?: string[];
  x: number;
  y: number;
  learned: boolean;
  prerequisites: string[];
}

export interface TalentEdge {
  from: string;
  to: string;
}

export const talentNodes: TalentNode[] = [
  // ─── Frontend Tree ───
  { id: "html", name: "HTML", description: "The foundation of all web structures. Mastery of semantic markup and accessibility incantations.", icon: "FileCode", tree: "frontend", x: 0, y: 0, learned: true, prerequisites: [] },
  { id: "css", name: "CSS", description: "The art of visual enchantment. Command over layouts, animations, and responsive transformations.", icon: "Palette", tree: "frontend", x: 1, y: 0, learned: true, prerequisites: [] },
  { id: "scss", name: "SCSS", description: "Advanced CSS sorcery. Variables, mixins, and nesting grant superior styling power.", icon: "Brush", tree: "frontend", x: 0, y: 1, learned: true, prerequisites: ["css"] },
  { id: "php", name: "PHP", description: "Server-side scripting language. The old-world magic that still powers much of the web.", icon: "FileCode", tree: "frontend", x: 2, y: 1, learned: true, prerequisites: ["js"] },
  { id: "web-frontend", name: "Web Frontend", description: "The convergence of HTML, CSS, and JavaScript. Unlocks React, Vue, and modern framework mastery.", icon: "Layout", tree: "frontend", x: 1, y: 2, learned: true, prerequisites: ["html", "css", "js"] },
  { id: "react-native", name: "React Native", description: "Cross-platform mobile sorcery. Build native mobile apps using React's component model.", icon: "Smartphone", tree: "frontend", x: 0, y: 3, learned: true, prerequisites: ["web-frontend"] },
  { id: "vuejs", name: "Vue.js", description: "The progressive framework. Reactive data binding and component composition for elegant interfaces.", icon: "Hexagon", tree: "frontend", x: 1, y: 3, learned: true, prerequisites: ["web-frontend"] },
  { id: "yii2", name: "Yii2 Framework", description: "High-performance PHP framework. MVC architecture with built-in security and caching enchantments.", icon: "Box", tree: "frontend", x: 2, y: 2, learned: true, prerequisites: ["php"] },
  { id: "laravel", name: "Laravel", description: "The artisan's PHP framework. Eloquent ORM, Blade templating, and elegant syntax for rapid development.", icon: "Gem", tree: "frontend", x: 3, y: 2, learned: true, prerequisites: ["php"] },
  { id: "redux", name: "React Redux", description: "Global state management for React. A single store of truth that controls the flow of data across all components.", icon: "GitMerge", tree: "frontend", x: 2, y: 3, learned: true, prerequisites: ["web-frontend"] },
  { id: "mvc", name: "MVC Pattern", description: "Model-View-Controller architecture. The sacred pattern for organizing code into logical domains.", icon: "Layers", tree: "frontend", x: 3, y: 3, learned: true, prerequisites: ["yii2", "laravel"] },

  // ─── Shared ───
  { id: "js", name: "JavaScript", description: "The language of interactivity. Wield the power of dynamic scripting and DOM manipulation.", icon: "Braces", tree: "shared", sharedTrees: ["frontend", "backend"], x: 3.5, y: 0, learned: true, prerequisites: [] },

  // ─── Backend Tree ───
  { id: "nodejs", name: "Node.js", description: "Server-side JavaScript runtime. Harness the power of V8 to build scalable network applications.", icon: "Hexagon", tree: "backend", x: 5, y: 0, learned: true, prerequisites: ["js"] },
  { id: "nextjs", name: "Next.js", description: "The React meta-framework. Server-side rendering, static generation, and API routes in one package.", icon: "Triangle", tree: "backend", x: 5, y: 1, learned: true, prerequisites: ["nodejs"] },
  { id: "backend-web", name: "Backend Web", description: "Full server-side mastery. REST APIs, authentication, database design, and deployment strategies.", icon: "Database", tree: "backend", x: 5, y: 2, learned: true, prerequisites: ["nextjs"] },
  { id: "restful-api", name: "RESTful API", description: "Representational State Transfer. Design and implement clean, resource-oriented web service interfaces.", icon: "ArrowLeftRight", tree: "backend", x: 4, y: 2, learned: true, prerequisites: ["nodejs"] },
  { id: "ajax", name: "AJAX", description: "Asynchronous JavaScript and XML. Enables dynamic page updates without full reloads.", icon: "RefreshCw", tree: "backend", x: 4, y: 1, learned: true, prerequisites: ["nodejs"] },
  { id: "socketio", name: "Socket.io", description: "Real-time event-based communication library. Bidirectional data flow between client and server.", icon: "Radio", tree: "backend", x: 6, y: 2, learned: true, prerequisites: ["backend-web"] },
  { id: "websockets", name: "WebSockets", description: "Real-time bidirectional communication protocol. The ultimate synergy for live data streams.", icon: "Zap", tree: "backend", x: 6, y: 3, learned: true, prerequisites: ["socketio", "backend-web"] },

  // ─── SQL Tree ───
  { id: "relational-db", name: "Relational DB", description: "Structured data storage with tables, relations, and SQL query language. The bedrock of data persistence.", icon: "Database", tree: "sql", x: 8, y: 0, learned: true, prerequisites: [] },
  { id: "mysql", name: "MySQL / MariaDB", description: "The most widely-used open-source relational database. Fast reads, reliable replication.", icon: "Database", tree: "sql", x: 7.5, y: 1, learned: true, prerequisites: ["relational-db"] },
  { id: "postgresql", name: "PostgreSQL", description: "Advanced open-source relational database. JSON support, full-text search, and extensibility.", icon: "Database", tree: "sql", x: 8.5, y: 1, learned: true, prerequisites: ["relational-db"] },
  { id: "nonrelational-db", name: "Non-Relational DB", description: "Schema-less document stores for flexible, high-velocity data. Key-value and document models.", icon: "Layers", tree: "sql", x: 8, y: 2, learned: true, prerequisites: [] },
  { id: "mongodb", name: "MongoDB", description: "Document-oriented NoSQL database. JSON-like documents with dynamic schemas for rapid iteration.", icon: "Database", tree: "sql", x: 8, y: 3, learned: true, prerequisites: ["nonrelational-db"] },

  // ─── VoIP Tree ───
  { id: "asterisk", name: "Asterisk", description: "Open-source telephony engine. The foundation of custom PBX systems and call routing.", icon: "Phone", tree: "voip", x: 10.5, y: 0, learned: true, prerequisites: [] },
  { id: "pbx", name: "PBX", description: "Private Branch Exchange. Internal telephone switching system for enterprise communications.", icon: "Phone", tree: "voip", x: 10, y: 1, learned: true, prerequisites: ["asterisk"] },
  { id: "freepbx", name: "FreePBX", description: "Open-source PBX management GUI. Simplifies Asterisk configuration with a web interface.", icon: "Phone", tree: "voip", x: 10, y: 2, learned: true, prerequisites: ["pbx"] },
  { id: "elastix", name: "Elastix", description: "Unified communications platform built on Asterisk. Integrates email, IM, and fax with telephony.", icon: "Phone", tree: "voip", x: 10, y: 3, learned: true, prerequisites: ["pbx"] },
  { id: "cisco", name: "Cisco", description: "Enterprise networking and communications. The industry standard for large-scale deployments.", icon: "Router", tree: "voip", x: 11.5, y: 1, learned: true, prerequisites: ["asterisk"] },
  { id: "cucm", name: "CUCM", description: "Cisco Unified Communications Manager. Enterprise call control and session management.", icon: "Phone", tree: "voip", x: 11, y: 2, learned: true, prerequisites: ["cisco"] },
  { id: "uccx", name: "UCCX", description: "Cisco Unified Contact Center Express. IVR, ACD, and call queuing for contact centers.", icon: "Headphones", tree: "voip", x: 12, y: 2, learned: true, prerequisites: ["cisco"] },
  { id: "cuic", name: "CUIC", description: "Cisco Unified Intelligence Center. Reporting and analytics for contact center operations.", icon: "BarChart", tree: "voip", x: 11, y: 3, learned: true, prerequisites: ["cucm"] },
  { id: "cisco-ucs", name: "Cisco UCS", description: "Cisco Unified Contact Systems. Full-stack enterprise communication and contact management.", icon: "Server", tree: "voip", x: 12, y: 3, learned: true, prerequisites: ["uccx"] },
  { id: "sip", name: "SIP", description: "Session Initiation Protocol. Signaling protocol for initiating, maintaining, and terminating voice sessions.", icon: "PhoneCall", tree: "voip", x: 9.5, y: 1, learned: true, prerequisites: [] },
  { id: "rtp", name: "RTP", description: "Real-time Transport Protocol. Delivers audio and video over IP networks with timing information.", icon: "Radio", tree: "voip", x: 9.5, y: 2, learned: true, prerequisites: ["sip"] },
  { id: "webrtc", name: "WebRTC", description: "Web Real-Time Communication. Browser-native voice, video, and data channel capabilities.", icon: "Video", tree: "voip", x: 9.5, y: 3, learned: true, prerequisites: ["rtp"] },
  { id: "tts-stt", name: "TTS / STT", description: "Text-to-Speech and Speech-to-Text. Voice synthesis and recognition for IVR and accessibility.", icon: "Mic", tree: "voip", x: 11.5, y: 4, learned: true, prerequisites: ["asterisk"] },
  { id: "ivr-dev", name: "IVR Development", description: "Interactive Voice Response systems. Automated call menus, DTMF handling, and call flow design.", icon: "PhoneForwarded", tree: "voip", x: 10.5, y: 4, learned: true, prerequisites: ["asterisk", "tts-stt"] },
];

export const talentEdges: TalentEdge[] = [
  // Frontend
  { from: "html", to: "web-frontend" },
  { from: "css", to: "web-frontend" },
  { from: "css", to: "scss" },
  { from: "js", to: "web-frontend" },
  { from: "js", to: "php" },
  { from: "web-frontend", to: "react-native" },
  { from: "web-frontend", to: "vuejs" },
  { from: "web-frontend", to: "redux" },
  { from: "php", to: "yii2" },
  { from: "php", to: "laravel" },
  { from: "yii2", to: "mvc" },
  { from: "laravel", to: "mvc" },
  // Backend
  { from: "js", to: "nodejs" },
  { from: "nodejs", to: "nextjs" },
  { from: "nodejs", to: "ajax" },
  { from: "nodejs", to: "restful-api" },
  { from: "nextjs", to: "backend-web" },
  { from: "backend-web", to: "socketio" },
  { from: "socketio", to: "websockets" },
  { from: "backend-web", to: "websockets" },
  // SQL
  { from: "relational-db", to: "mysql" },
  { from: "relational-db", to: "postgresql" },
  { from: "nonrelational-db", to: "mongodb" },
  // VoIP
  { from: "asterisk", to: "pbx" },
  { from: "asterisk", to: "cisco" },
  { from: "asterisk", to: "tts-stt" },
  { from: "pbx", to: "freepbx" },
  { from: "pbx", to: "elastix" },
  { from: "cisco", to: "cucm" },
  { from: "cisco", to: "uccx" },
  { from: "cucm", to: "cuic" },
  { from: "uccx", to: "cisco-ucs" },
  { from: "sip", to: "rtp" },
  { from: "rtp", to: "webrtc" },
  { from: "tts-stt", to: "ivr-dev" },
  { from: "asterisk", to: "ivr-dev" },
];

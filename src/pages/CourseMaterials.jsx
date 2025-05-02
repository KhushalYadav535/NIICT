import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const CourseMaterials = () => {
  const [selectedContent, setSelectedContent] = useState(null);

  const materials = [
    {
      title: 'CCC (Course on Computer Concepts)',
      resources: [
        { 
          type: 'notes',
          name: 'Introduction to Computer Fundamentals',
          downloadUrl: '/materials/computer-fundamentals.pdf',
          content: '# Computer Fundamentals\n\n## What is a Computer?\nA computer is an electronic device that processes data according to a set of instructions. It follows the IPO cycle (Input → Processing → Output) to perform tasks.\n\n## Basic Components\n### 1. CPU (Central Processing Unit)\n- Control Unit: Manages and coordinates computer operations\n- ALU (Arithmetic Logic Unit): Performs mathematical calculations\n- Registers: Small, high-speed memory units\n- Clock Speed: Measured in GHz, determines processing speed\n\n### 2. Memory\n- RAM (Random Access Memory):\n  - Temporary storage\n  - Volatile memory\n  - Faster access speed\n  - Common sizes: 4GB, 8GB, 16GB, 32GB\n\n- ROM (Read Only Memory):\n  - Permanent storage\n  - Non-volatile memory\n  - Contains BIOS/UEFI\n  - Types: PROM, EPROM, EEPROM\n\n### 3. Input/Output Devices\n- Input Devices:\n  - Keyboard: Standard QWERTY layout\n  - Mouse: Optical/Mechanical\n  - Scanner: Flatbed/Document\n  - Microphone: Audio input\n\n- Output Devices:\n  - Monitor: LCD/LED display\n  - Printer: Inkjet/Laser\n  - Speakers: Audio output\n  - Projector: Image projection\n\n### 4. Storage Devices\n- Primary Storage:\n  - RAM and ROM\n  - Cache memory\n\n- Secondary Storage:\n  - HDD: Large capacity, slower\n  - SSD: Faster, more reliable\n  - USB drives: Portable storage\n  - Cloud storage: Online backup\n\n## Types of Software\n### 1. System Software\n- Operating Systems:\n  - Windows\n  - macOS\n  - Linux\n  - Android/iOS\n\n- Utility Programs:\n  - Antivirus\n  - Disk cleanup\n  - File compression\n  - System backup\n\n### 2. Application Software\n- Productivity Software:\n  - MS Office Suite\n  - Adobe Creative Suite\n  - Web browsers\n\n- Development Tools:\n  - Programming IDEs\n  - Code editors\n  - Debugging tools\n\n## Computer Networks\n- LAN (Local Area Network)\n- WAN (Wide Area Network)\n- Internet connectivity\n- Network security basics'
        },
        { 
          type: 'notes',
          name: 'MS Office Basics',
          content: '# MS Office Suite\n\n## MS Word\n### Document Creation & Formatting\n- Page Layout:\n  - Margins and orientation\n  - Headers and footers\n  - Page numbers\n  - Columns\n\n- Text Formatting:\n  - Font styles and sizes\n  - Paragraph spacing\n  - Bullets and numbering\n  - Text effects\n\n### Advanced Features\n- Tables:\n  - Create and format tables\n  - Merge and split cells\n  - Table styles\n  - Cell borders and shading\n\n- Graphics:\n  - Insert and edit images\n  - SmartArt graphics\n  - Shapes and text boxes\n  - Picture effects\n\n- Mail Merge:\n  - Data sources\n  - Merge fields\n  - Preview results\n  - Complete merge\n\n## MS Excel\n### Spreadsheet Basics\n- Workbook Structure:\n  - Sheets and cells\n  - Navigation\n  - Data entry\n  - Cell formatting\n\n### Formulas & Functions\n- Basic Operations:\n  - SUM, AVERAGE\n  - COUNT, COUNTA\n  - MAX, MIN\n\n- Advanced Functions:\n  - VLOOKUP, HLOOKUP\n  - IF conditions\n  - INDEX-MATCH\n  - SUMIF, COUNTIF\n\n### Data Analysis\n- Charts & Graphs:\n  - Column and bar charts\n  - Line and pie charts\n  - Scatter plots\n  - Chart formatting\n\n- Data Tools:\n  - Sorting and filtering\n  - Pivot tables\n  - Data validation\n  - Conditional formatting\n\n## MS PowerPoint\n### Presentation Basics\n- Slide Design:\n  - Themes and layouts\n  - Color schemes\n  - Background styles\n  - Master slides\n\n### Content Creation\n- Text Elements:\n  - Title slides\n  - Bullet points\n  - Text boxes\n  - WordArt\n\n- Multimedia:\n  - Images and shapes\n  - Audio and video\n  - Screen recordings\n  - Charts and SmartArt\n\n### Animations & Transitions\n- Slide Transitions:\n  - Effect types\n  - Timing settings\n  - Sound effects\n\n- Custom Animations:\n  - Entrance effects\n  - Emphasis effects\n  - Exit effects\n  - Motion paths\n\n### Presentation Delivery\n- Slide Show Setup:\n  - Rehearse timings\n  - Speaker notes\n  - Custom shows\n  - Presentation tools'
        },
        { 
          type: 'notes',
          name: 'Internet & Email',
          content: '# Internet Fundamentals\n\n## Internet Architecture\n### Network Basics\n- TCP/IP Protocol\n- Client-Server Model\n- IP Addressing:\n  - IPv4 vs IPv6\n  - Public vs Private IP\n\n### Connection Types\n- Broadband\n- Fiber-optic\n- Mobile data (4G/5G)\n- Wi-Fi standards\n\n## Web Technologies\n### Web Browsers\n- Popular Browsers:\n  - Google Chrome\n  - Mozilla Firefox\n  - Microsoft Edge\n  - Safari\n\n- Browser Features:\n  - Bookmarks\n  - History\n  - Extensions\n  - Developer tools\n\n### Search Engines\n- Search Techniques:\n  - Keywords\n  - Advanced operators\n  - Filters\n\n- Popular Engines:\n  - Google\n  - Bing\n  - DuckDuckGo\n\n### URLs and Domains\n- URL Structure:\n  - Protocol (http/https)\n  - Domain name\n  - Path\n  - Parameters\n\n- Domain Types:\n  - gTLD (.com, .org, .net)\n  - ccTLD (.in, .uk, .us)\n  - New TLDs (.app, .web)\n\n## Email Communication\n### Email Basics\n- Account Creation:\n  - Choosing providers\n  - Security settings\n  - Recovery options\n\n- Email Structure:\n  - To, Cc, Bcc fields\n  - Subject line\n  - Body content\n  - Attachments\n\n### Email Management\n- Organization:\n  - Folders/Labels\n  - Filters\n  - Search techniques\n  - Archiving\n\n- Security:\n  - Spam filters\n  - Phishing awareness\n  - Password protection\n  - Two-factor authentication\n\n### Email Etiquette\n- Professional Writing:\n  - Clear subject lines\n  - Proper greetings\n  - Concise content\n  - Signature blocks\n\n- Best Practices:\n  - Response timing\n  - CC/BCC usage\n  - Attachment handling\n  - Follow-up protocols\n\n## Internet Security\n- Safe Browsing:\n  - HTTPS importance\n  - Privacy settings\n  - Cookie management\n\n- Online Privacy:\n  - Data protection\n  - Digital footprint\n  - Social media safety\n\n- Security Tools:\n  - Antivirus software\n  - VPN services\n  - Password managers'
        }
      ]
    },
    {
      title: 'ADCA (Advanced Diploma in Computer Applications)',
      resources: [
        { 
          type: 'notes',
          name: 'Operating Systems',
          content: '# Operating Systems\n\n## Windows Operating System\n### File Management\n- File Explorer:\n  - Navigation pane\n  - Quick access\n  - Search functionality\n  - File operations\n\n- File Organization:\n  - Libraries\n  - Folders structure\n  - File naming conventions\n  - File extensions\n\n- File Sharing:\n  - Network sharing\n  - Permission settings\n  - OneDrive integration\n  - HomeGroup\n\n### Control Panel\n- System Settings:\n  - Display and sound\n  - Network connections\n  - Power options\n  - User accounts\n\n- Hardware Settings:\n  - Device manager\n  - Printers\n  - Mouse and keyboard\n  - Display adapters\n\n- Security Settings:\n  - Windows Defender\n  - Firewall\n  - Updates\n  - Backup\n\n### System Tools\n- Disk Management:\n  - Disk cleanup\n  - Disk defragmentation\n  - Disk partitioning\n  - Storage spaces\n\n- Task Management:\n  - Task manager\n  - Resource monitor\n  - Performance monitor\n  - Event viewer\n\n## Linux Operating System\n### Basic Commands\n- File Operations:\n  - ls (list files)\n  - cd (change directory)\n  - cp (copy)\n  - mv (move)\n  - rm (remove)\n\n- Text Processing:\n  - cat (view file)\n  - nano/vim (edit file)\n  - grep (search text)\n  - sed (stream editor)\n\n- System Commands:\n  - top (process view)\n  - ps (process status)\n  - kill (terminate process)\n  - systemctl (service control)\n\n### File System\n- Directory Structure:\n  - /root (root directory)\n  - /home (user homes)\n  - /etc (configuration)\n  - /var (variable data)\n\n- File Permissions:\n  - Read/Write/Execute\n  - User/Group/Others\n  - chmod command\n  - chown command\n\n### Package Management\n- APT (Debian/Ubuntu):\n  - apt update\n  - apt install\n  - apt remove\n  - apt upgrade\n\n- YUM (RedHat/CentOS):\n  - yum install\n  - yum update\n  - yum remove\n  - yum search\n\n### System Administration\n- User Management:\n  - Adding users\n  - Setting permissions\n  - Group management\n  - Password policies\n\n- Network Configuration:\n  - IP settings\n  - DNS configuration\n  - Firewall rules\n  - Network troubleshooting'
        },
        { 
          type: 'notes',
          name: 'Programming Fundamentals',
          content: '# Programming Fundamentals\n\n## C Programming\n### Basics\n- Structure of C Program:\n  - Header files\n  - Main function\n  - Preprocessor directives\n  - Comments\n\n- Variables & Data Types:\n  - int, float, char\n  - Arrays and strings\n  - Pointers\n  - Type modifiers\n\n### Control Structures\n- Conditional Statements:\n  - if-else\n  - switch-case\n  - Nested conditions\n\n- Loops:\n  - for loop\n  - while loop\n  - do-while loop\n  - Loop control statements\n\n### Functions\n- Function Types:\n  - User-defined functions\n  - Library functions\n  - Recursive functions\n\n- Parameter Passing:\n  - Call by value\n  - Call by reference\n  - Return values\n\n### Arrays & Strings\n- Array Operations:\n  - Declaration\n  - Initialization\n  - Multi-dimensional arrays\n  - Array manipulation\n\n- String Handling:\n  - String functions\n  - Character arrays\n  - String manipulation\n\n## C++ Programming\n### Object-Oriented Concepts\n- Classes & Objects:\n  - Class definition\n  - Object creation\n  - Access specifiers\n  - Member functions\n\n- Constructors & Destructors:\n  - Default constructor\n  - Parameterized constructor\n  - Copy constructor\n  - Destructor\n\n- Inheritance:\n  - Single inheritance\n  - Multiple inheritance\n  - Multilevel inheritance\n  - Access modes\n\n### Advanced Features\n- Polymorphism:\n  - Function overloading\n  - Operator overloading\n  - Virtual functions\n  - Runtime polymorphism\n\n- Exception Handling:\n  - Try-catch blocks\n  - Throw statement\n  - Custom exceptions\n\n- Templates:\n  - Function templates\n  - Class templates\n  - Template specialization\n\n### STL (Standard Template Library)\n- Containers:\n  - Vector\n  - List\n  - Map\n  - Set\n\n- Algorithms:\n  - Sorting\n  - Searching\n  - Manipulations\n\n### File Handling\n- File Operations:\n  - File streams\n  - Reading files\n  - Writing files\n  - Error handling'
        },
        { 
          type: 'notes',
          name: 'Database Management',
          content: '# Database Management Systems\n\n## SQL (Structured Query Language)\n### Database Basics\n- Database Concepts:\n  - Tables and fields\n  - Primary and foreign keys\n  - Indexes\n  - Constraints\n\n- Data Types:\n  - Numeric types\n  - Character types\n  - Date/Time types\n  - Binary types\n\n### SQL Queries\n- Basic Queries:\n  - SELECT statement\n  - WHERE clause\n  - ORDER BY\n  - GROUP BY\n\n- Advanced Queries:\n  - Joins (INNER, LEFT, RIGHT)\n  - Subqueries\n  - UNION and INTERSECT\n  - Aggregate functions\n\n### Database Design\n- Normalization:\n  - First Normal Form (1NF)\n  - Second Normal Form (2NF)\n  - Third Normal Form (3NF)\n\n- Relationships:\n  - One-to-One\n  - One-to-Many\n  - Many-to-Many\n  - Referential integrity\n\n## MS Access\n### Forms\n- Form Design:\n  - Single-form view\n  - Split forms\n  - Multiple-item forms\n  - Navigation forms\n\n- Form Controls:\n  - Text boxes\n  - Combo boxes\n  - Check boxes\n  - Command buttons\n\n### Reports\n- Report Types:\n  - Simple reports\n  - Grouped reports\n  - Summary reports\n  - Labels\n\n- Report Features:\n  - Sorting and grouping\n  - Calculations\n  - Subreports\n  - Report formatting\n\n### Queries\n- Query Types:\n  - Select queries\n  - Action queries\n  - Parameter queries\n  - Crosstab queries\n\n- Query Design:\n  - Criteria\n  - Calculated fields\n  - Expressions\n  - Query wizards\n\n### Database Administration\n- Security:\n  - User accounts\n  - Permissions\n  - Encryption\n  - Backup strategies\n\n- Performance:\n  - Index optimization\n  - Query optimization\n  - Database compacting\n  - Performance monitoring\n\n### Integration\n- Data Import/Export:\n  - Excel integration\n  - Text files\n  - XML data\n  - SharePoint lists\n\n- Automation:\n  - Macros\n  - VBA programming\n  - Scheduled tasks\n  - Error handling'
        }
      ]
    },
    {
      title: 'DIT (Diploma in Information Technology)',
      resources: [
        { 
          type: 'notes',
          name: 'Web Development',
          content: '# Web Development\n\n## HTML5\n### Document Structure\n- Basic Elements:\n  - DOCTYPE declaration\n  - html, head, body\n  - meta tags\n  - title\n\n- Semantic Elements:\n  - header, nav, main\n  - article, section\n  - aside, footer\n  - figure, figcaption\n\n### Content Elements\n- Text Elements:\n  - Headings (h1-h6)\n  - Paragraphs (p)\n  - Lists (ul, ol, li)\n  - Links (a)\n\n- Multimedia:\n  - Images (img)\n  - Audio (audio)\n  - Video (video)\n  - Canvas\n\n## CSS3\n### Selectors & Properties\n- Selector Types:\n  - Element selectors\n  - Class selectors\n  - ID selectors\n  - Attribute selectors\n\n- Box Model:\n  - Margin\n  - Border\n  - Padding\n  - Content\n\n### Layout & Positioning\n- Display Properties:\n  - block\n  - inline\n  - flex\n  - grid\n\n- Position Types:\n  - static\n  - relative\n  - absolute\n  - fixed\n  - sticky\n\n### Responsive Design\n- Media Queries:\n  - Breakpoints\n  - Device targeting\n  - Orientation\n\n- Flexbox:\n  - Container properties\n  - Item properties\n  - Alignment\n  - Order\n\n- CSS Grid:\n  - Grid container\n  - Grid items\n  - Grid areas\n  - Auto-placement\n\n## JavaScript\n### Core Concepts\n- Variables & Data Types:\n  - var, let, const\n  - Numbers, strings\n  - Objects, arrays\n  - Boolean, null, undefined\n\n- Control Flow:\n  - if statements\n  - loops (for, while)\n  - switch statements\n  - try-catch\n\n### Functions\n- Function Types:\n  - Function declarations\n  - Function expressions\n  - Arrow functions\n  - Callbacks\n\n- Scope & Closure:\n  - Global scope\n  - Local scope\n  - Lexical scope\n  - Closures\n\n### DOM Manipulation\n- Selecting Elements:\n  - getElementById\n  - querySelector\n  - getElementsByClassName\n  - querySelectorAll\n\n- Modifying Elements:\n  - innerHTML\n  - textContent\n  - classList\n  - attributes\n\n### Events\n- Event Types:\n  - Mouse events\n  - Keyboard events\n  - Form events\n  - Window events\n\n- Event Handling:\n  - addEventListener\n  - removeEventListener\n  - Event bubbling\n  - Event delegation\n\n### Modern JavaScript\n- ES6+ Features:\n  - Template literals\n  - Destructuring\n  - Spread operator\n  - Modules\n\n- Asynchronous JS:\n  - Promises\n  - async/await\n  - Fetch API\n  - JSON handling'
        },
        { 
          type: 'notes',
          name: 'Networking Fundamentals',
          content: '# Computer Networks\n\n## Network Fundamentals\n### Network Types\n- LAN (Local Area Network):\n  - Ethernet\n  - Wi-Fi\n  - Network topology\n  - VLAN\n\n- WAN (Wide Area Network):\n  - Internet connectivity\n  - VPN\n  - Leased lines\n  - MPLS\n\n- Other Types:\n  - MAN (Metropolitan Area Network)\n  - PAN (Personal Area Network)\n  - SAN (Storage Area Network)\n\n### Network Protocols\n- TCP/IP Protocol Suite:\n  - IP (Internet Protocol)\n  - TCP (Transmission Control Protocol)\n  - UDP (User Datagram Protocol)\n  - ICMP (Internet Control Message Protocol)\n\n- Application Protocols:\n  - HTTP/HTTPS\n  - FTP/SFTP\n  - SMTP/POP3/IMAP\n  - DNS\n\n### IP Addressing\n- IPv4:\n  - Address classes\n  - Subnetting\n  - CIDR notation\n  - NAT/PAT\n\n- IPv6:\n  - Address format\n  - Address types\n  - Transition mechanisms\n  - Dual stack\n\n## Network Security\n### Security Threats\n- Common Attacks:\n  - DDoS attacks\n  - Man-in-the-middle\n  - Phishing\n  - Malware\n\n- Vulnerabilities:\n  - Software vulnerabilities\n  - Zero-day exploits\n  - Social engineering\n  - Password attacks\n\n### Protection Mechanisms\n- Firewalls:\n  - Packet filtering\n  - Stateful inspection\n  - Application layer\n  - Next-gen firewalls\n\n- IDS/IPS:\n  - Network-based\n  - Host-based\n  - Signature detection\n  - Anomaly detection\n\n### Encryption & Security\n- Encryption Types:\n  - Symmetric encryption\n  - Asymmetric encryption\n  - Hash functions\n  - Digital signatures\n\n- Security Protocols:\n  - SSL/TLS\n  - IPSec\n  - SSH\n  - WPA3\n\n### Network Management\n- Monitoring:\n  - SNMP\n  - Network analyzers\n  - Log management\n  - Performance metrics\n\n- Security Policies:\n  - Access control\n  - Password policies\n  - Incident response\n  - Disaster recovery'
        },
        { 
          type: 'notes',
          name: 'Software Engineering',
          content: '# Software Engineering\n\n## Software Development Life Cycle (SDLC)\n### Requirements Analysis\n- Gathering Requirements:\n  - Stakeholder interviews\n  - Use case analysis\n  - User stories\n  - Requirements documentation\n\n- Types of Requirements:\n  - Functional requirements\n  - Non-functional requirements\n  - Technical requirements\n  - Business requirements\n\n### System Design\n- Architecture Design:\n  - System architecture\n  - Component design\n  - Database design\n  - Interface design\n\n- Design Patterns:\n  - Creational patterns\n  - Structural patterns\n  - Behavioral patterns\n  - MVC pattern\n\n### Implementation\n- Coding Standards:\n  - Naming conventions\n  - Code organization\n  - Documentation\n  - Version control\n\n- Best Practices:\n  - Clean code\n  - Code reviews\n  - Pair programming\n  - Continuous Integration\n\n### Testing\n- Testing Levels:\n  - Unit testing\n  - Integration testing\n  - System testing\n  - Acceptance testing\n\n- Testing Types:\n  - Functional testing\n  - Performance testing\n  - Security testing\n  - Usability testing\n\n## Project Management\n### Planning\n- Project Initiation:\n  - Project charter\n  - Scope definition\n  - Feasibility study\n  - Risk assessment\n\n- Resource Planning:\n  - Team allocation\n  - Time estimation\n  - Cost estimation\n  - Tool selection\n\n### Execution\n- Development Methodologies:\n  - Waterfall\n  - Agile/Scrum\n  - Kanban\n  - DevOps\n\n- Team Management:\n  - Task assignment\n  - Communication\n  - Collaboration\n  - Conflict resolution\n\n### Monitoring & Control\n- Progress Tracking:\n  - Milestones\n  - Deliverables\n  - Timeline management\n  - Budget tracking\n\n- Quality Assurance:\n  - Code quality\n  - Performance metrics\n  - Bug tracking\n  - Documentation\n\n### Project Closure\n- Deployment:\n  - Release planning\n  - Production deployment\n  - User training\n  - Documentation\n\n- Maintenance:\n  - Bug fixes\n  - Updates\n  - Support\n  - Performance optimization'
        }
      ]
    },
    {
      title: 'Coral Draw',
      resources: [
        { 
          type: 'notes',
          name: 'Interface & Tools',
          content: '# CorelDraw Interface\n\n## Basic Tools\n- Pick tool\n- Shape tool\n- Zoom tool\n\n## Drawing Tools\n- Rectangle\n- Ellipse\n- Polygon\n- Text'
        },
        { 
          type: 'notes',
          name: 'Color & Effects',
          content: '# Colors and Effects\n\n## Color Management\n- Color palettes\n- Color harmonies\n- Gradients\n\n## Effects\n- Transparency\n- Drop shadow\n- Contour\n- Blend'
        },
        { 
          type: 'notes',
          name: 'Advanced Techniques',
          content: '# Advanced Features\n\n## Layout\n- Master pages\n- Guidelines\n- Alignment\n\n## Export\n- File formats\n- Print preparation\n- Web graphics'
        }
      ]
    },
    {
      title: 'O Level',
      resources: [
        { 
          type: 'notes',
          name: 'IT Fundamentals',
          content: '# Information Technology\n\n## Computer System\n- Hardware components\n- Software types\n- System architecture\n\n## Data Representation\n- Number systems\n- Data encoding\n- File formats'
        },
        { 
          type: 'notes',
          name: 'Programming Concepts',
          content: '# Programming\n\n## Basic Concepts\n- Algorithms\n- Flowcharts\n- Pseudocode\n\n## Programming Languages\n- Types of languages\n- Compilers vs Interpreters\n- Basic syntax'
        },
        { 
          type: 'notes',
          name: 'Web Technologies',
          content: '# Web Technologies\n\n## Web Concepts\n- Client-server architecture\n- Web browsers\n- Web servers\n\n## Web Development\n- HTML basics\n- CSS styling\n- JavaScript introduction'
        }
      ]
    },
    {
      title: 'Advanced Web Development',
      resources: [
        {
          type: 'notes',
          name: 'Frontend Development',
          content: '# Frontend Development\n\n## React.js\n### Core Concepts\n- Components & Props:\n  - Functional components\n  - Class components\n  - Props drilling\n  - PropTypes\n\n- State Management:\n  - useState\n  - useEffect\n  - Context API\n  - Redux/Redux Toolkit\n\n- Routing:\n  - React Router\n  - Dynamic routes\n  - Protected routes\n  - Navigation\n\n### Advanced React\n- Performance:\n  - Memo\n  - useMemo\n  - useCallback\n  - Code splitting\n\n- Custom Hooks:\n  - Hook rules\n  - State hooks\n  - Effect hooks\n  - API hooks\n\n## Next.js\n### Fundamentals\n- Routing:\n  - File-based routing\n  - Dynamic routes\n  - Catch-all routes\n  - Middleware\n\n- Data Fetching:\n  - getStaticProps\n  - getServerSideProps\n  - Incremental Static Regeneration\n  - SWR/React Query\n\n### Advanced Features\n- API Routes:\n  - API handlers\n  - Dynamic API routes\n  - API middleware\n  - Error handling\n\n- Optimization:\n  - Image optimization\n  - Font optimization\n  - Analytics\n  - Performance monitoring\n\n## UI/UX Design\n### Design Principles\n- Layout:\n  - Grid systems\n  - Responsive design\n  - Mobile-first approach\n  - Typography\n\n- User Experience:\n  - Navigation patterns\n  - Form design\n  - Accessibility\n  - Performance\n\n### Design Tools\n- Figma:\n  - Interface design\n  - Prototyping\n  - Components\n  - Collaboration\n\n- Design Systems:\n  - Style guides\n  - Component libraries\n  - Documentation\n  - Version control'
        },
        {
          type: 'notes',
          name: 'Backend Development',
          content: '# Backend Development\n\n## Node.js\n### Core Concepts\n- Event Loop:\n  - Asynchronous programming\n  - Callbacks\n  - Promises\n  - async/await\n\n- Modules:\n  - Built-in modules\n  - NPM packages\n  - Custom modules\n  - Module patterns\n\n### Express.js\n- Routing:\n  - Route methods\n  - Route parameters\n  - Query strings\n  - Middleware\n\n- API Development:\n  - RESTful APIs\n  - Authentication\n  - Authorization\n  - Error handling\n\n## Database Integration\n### MongoDB\n- CRUD Operations:\n  - Create documents\n  - Read queries\n  - Update operations\n  - Delete operations\n\n- Mongoose:\n  - Schemas\n  - Models\n  - Validation\n  - Middleware\n\n### SQL Databases\n- PostgreSQL:\n  - Table design\n  - Relationships\n  - Queries\n  - Indexing\n\n- ORMs:\n  - Sequelize\n  - Prisma\n  - TypeORM\n  - Migrations\n\n## DevOps\n### Deployment\n- Cloud Platforms:\n  - AWS\n  - Google Cloud\n  - Azure\n  - Heroku\n\n- CI/CD:\n  - GitHub Actions\n  - Jenkins\n  - Docker\n  - Kubernetes\n\n### Security\n- Authentication:\n  - JWT\n  - OAuth\n  - Session management\n  - Password hashing\n\n- Security Best Practices:\n  - HTTPS\n  - CORS\n  - XSS prevention\n  - CSRF protection'
        }
      ]
    },
    {
      title: 'Data Analytics',
      resources: [
        {
          type: 'notes',
          name: 'Data Analysis Fundamentals',
          content: '# Data Analysis\n\n## Data Processing\n### Data Collection\n- Data Sources:\n  - Databases\n  - APIs\n  - Web scraping\n  - Surveys\n\n- Data Types:\n  - Structured data\n  - Unstructured data\n  - Time series\n  - Text data\n\n### Data Cleaning\n- Preprocessing:\n  - Missing values\n  - Outliers\n  - Duplicates\n  - Data validation\n\n- Data Transformation:\n  - Normalization\n  - Standardization\n  - Feature engineering\n  - Encoding\n\n## Statistical Analysis\n### Descriptive Statistics\n- Measures of Center:\n  - Mean\n  - Median\n  - Mode\n  - Weighted averages\n\n- Measures of Spread:\n  - Range\n  - Variance\n  - Standard deviation\n  - Quartiles\n\n### Inferential Statistics\n- Hypothesis Testing:\n  - T-tests\n  - Chi-square tests\n  - ANOVA\n  - Regression analysis\n\n- Probability:\n  - Distributions\n  - Confidence intervals\n  - P-values\n  - Statistical significance'
        },
        {
          type: 'notes',
          name: 'Data Visualization & Tools',
          content: '# Data Visualization & Tools\n\n## Python for Data Analysis\n### Pandas\n- Data Structures:\n  - Series\n  - DataFrames\n  - Index objects\n  - Data types\n\n- Data Operations:\n  - Filtering\n  - Grouping\n  - Merging\n  - Pivoting\n\n### NumPy\n- Array Operations:\n  - Array creation\n  - Indexing\n  - Broadcasting\n  - Vectorization\n\n- Mathematical Functions:\n  - Linear algebra\n  - Statistical functions\n  - Random numbers\n  - FFT\n\n## Visualization Tools\n### Matplotlib\n- Basic Plots:\n  - Line plots\n  - Scatter plots\n  - Bar charts\n  - Histograms\n\n- Advanced Features:\n  - Subplots\n  - Custom styles\n  - Annotations\n  - 3D plotting\n\n### Seaborn\n- Statistical Plots:\n  - Distribution plots\n  - Regression plots\n  - Categorical plots\n  - Heatmaps\n\n### Power BI\n- Data Modeling:\n  - Data sources\n  - Relationships\n  - DAX formulas\n  - Measures\n\n- Visualization:\n  - Dashboard design\n  - Interactive reports\n  - Custom visuals\n  - Publishing\n\n## Machine Learning Basics\n### Supervised Learning\n- Regression:\n  - Linear regression\n  - Polynomial regression\n  - Decision trees\n  - Random forests\n\n- Classification:\n  - Logistic regression\n  - SVM\n  - KNN\n  - Neural networks\n\n### Unsupervised Learning\n- Clustering:\n  - K-means\n  - Hierarchical clustering\n  - DBSCAN\n  - Dimensionality reduction\n\n### Model Evaluation\n- Metrics:\n  - Accuracy\n  - Precision\n  - Recall\n  - F1-score\n\n- Validation:\n  - Cross-validation\n  - Train-test split\n  - Overfitting\n  - Underfitting'
        }
      ]
    }
  ];

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'video':
        return '🎥';
      case 'code':
        return '💻';
      case 'notes':
        return '📝';
      default:
        return '📁';
    }
  };

  const handleViewContent = (content) => {
    setSelectedContent(content);
  };

  const closeContent = () => {
    setSelectedContent(null);
  };

  const handleDownload = (resource) => {
    // For demonstration, we'll create a text file for notes
    // In a real app, you would use the actual downloadUrl
    if (resource.type === 'notes') {
      const blob = new Blob([resource.content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${resource.name}.txt`);
    } else if (resource.downloadUrl) {
      // For other resources with downloadUrl
      window.open(resource.downloadUrl, '_blank');
    }
  };

  return (
    <div className="materials-container">
      <div className="materials-grid">
        {materials.map((section, index) => (
          <div key={index} className="material-section">
            <h3 className="section-title">{section.title}</h3>
            <div className="resources-list">
              {section.resources.map((resource, resourceIndex) => (
                <div key={resourceIndex} className="resource-card">
                  <div className="resource-icon">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="resource-details">
                    <h4 className="resource-name">{resource.name}</h4>
                    {resource.type === 'notes' ? (
                      <div className="button-group">
                        <button 
                          className="view-btn"
                          onClick={() => handleViewContent(resource.content)}
                        >
                          View Notes
                        </button>
                        <button 
                          className="download-btn"
                          onClick={() => handleDownload(resource)}
                        >
                          Download
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="resource-meta">
                          {resource.size || resource.duration || resource.files}
                        </p>
                        <button 
                          className="download-btn"
                          onClick={() => handleDownload(resource)}
                        >
                          Download
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedContent && (
        <div className="content-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={closeContent}>
              ×
            </button>
            <div className="markdown-content">
              {selectedContent.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index}>{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index}>{line.substring(3)}</h2>;
                } else if (line.startsWith('- ')) {
                  return <li key={index}>{line.substring(2)}</li>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index}>{line}</p>;
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseMaterials;
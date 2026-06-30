export const cicdPosts = [
  {
    "id": 18,
    "slug": "jenkins",
    "title": "Jenkins - Continuous Integration & Continuous Delivery (CI/CD) Automation Server",
    "date": "2026-06-20",
    "author": "Grabber Team",
    "category": "CI/CD",
    "readTime": "5 min",
    "featured": true,
    "excerpt": "Understand Jenkins CI/CD automation server workflows. Explore declarative pipelines, webhook triggers, robotics devops build pipelines, and artifact publishing structures.",
    "coverImage": "/blog/18-jenkins/genkins2.jpeg",
    "content": [
      {
        "type": "heading",
        "level": 1,
        "text": "Jenkins — Continuous Integration & Continuous Delivery (CI/CD) Automation Server"
      },
      {
        "type": "image",
        "url": "/blog/18-jenkins/genkins1.jpeg",
        "caption": "Jenkins CI/CD Pipeline Automation Master"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "1. Core Idea: An Automation Orchestrator"
      },
      {
        "type": "paragraph",
        "text": "Jenkins is NOT a programming framework, NOT a version control system, and NOT a deployment tool by itself. Instead, it is an automation server that orchestrates software build, test, and deployment pipelines in a Continuous Integration and Continuous Delivery (CI/CD) workflow."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "2. What Problem Jenkins Solves"
      },
      {
        "type": "paragraph",
        "text": "Without automated CI/CD systems, developers are forced to manually compile code, run tests locally, and upload binaries to servers. This manual flow is slow, hard to scale, and vulnerable to human error. Jenkins automates this lifecycle entirely: any code push to Git triggers a predictable, reproducible pipeline that compiles, tests, packages, and deploys the application."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "3. Jenkins Architecture & Components"
      },
      {
        "type": "paragraph",
        "text": "Jenkins distributes task execution using a Controller-Agent architecture:"
      },
      {
        "type": "image",
        "url": "/blog/18-jenkins/genkins4.jpeg",
        "caption": "Jenkins Architecture"
      },
      {
        "type": "list",
        "items": [
          "**Jenkins Controller (Master):** The central brain responsible for UI rendering, configuration, pipeline orchestration, scheduling, and plugin management.",
          "**Agents (Workers):** Distributed service nodes that receive directives from the controller and execute the actual build steps, tests, and deployment commands.",
          "**Pipelines:** User-defined workflow scripts outlining stages such as Build, Test, Package, and Deploy.",
          "**Plugins:** A modular library extending Jenkins features (e.g., GitHub, Docker, Kubernetes, or Slack notifications)."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "4. The CI/CD Pipeline Flow"
      },
      {
        "type": "paragraph",
        "text": "The lifecycle of a commit in a Jenkins pipeline flows unidirectionally:"
      },
      {
        "type": "mermaid",
        "code": "graph LR\n    Git[Git Push] -->|Webhook| Trigger[Jenkins Trigger]\n    Trigger -->|Compile| Build[Build Stage]\n    Build -->|Verify| Test[Test Stage]\n    Test -->|Release| Package[Package Stage]\n    Package -->|Deploy| Deploy[Deploy Stage]\n    Deploy -->|Alert| Feedback[Slack Notification]"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Pipeline Types"
      },
      {
        "type": "image",
        "url": "/blog/18-jenkins/genkins7.jpeg",
        "caption": "Jenkins Pipeline Types"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "5. Pipeline-As-Code: Declarative Pipelines"
      },
      {
        "type": "paragraph",
        "text": "Modern Jenkins uses Declarative Pipelines to define build steps inside a version-controlled file (Jenkinsfile):"
      },
      {
        "type": "code",
        "language": "groovy",
        "code": "pipeline {\n  agent any\n  stages {\n    stage('Build') {\n      steps {\n        echo 'Building project binaries...'\n      }\n    }\n    stage('Test') {\n      steps {\n        echo 'Running integration tests...'\n      }\n    }\n    stage('Deploy') {\n      steps {\n        echo 'Deploying to staging environment...'\n      }\n    }\n  }\n}"
      },
      {
        "type": "image",
        "url": "/blog/18-jenkins/genkins3.jpeg",
        "caption": "Declarative Pipelines"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "6. Jenkins in IoT & Robotics Systems"
      },
      {
        "type": "paragraph",
        "text": "For hardware systems like the ESP32 Grabber robot, a Jenkins pipeline coordinates both software dashboards and embedded firmware. Code commits trigger automated compilers (like PlatformIO) to build the binary firmware, execute test scripts verifying motor and sensor logic, upload the resulting `firmware.bin` to a local file storage host, and trigger remote dashboard rebuilds:"
      },
      {
        "type": "mermaid",
        "code": "graph TD\n    Repo[Git Commit] -->|Trigger| Master[Jenkins Controller]\n    Master -->|Firmware Job| Agent1[Firmware Worker]\n    Master -->|Dashboard Job| Agent2[Frontend Worker]\n    Agent1 -->|PlatformIO Build| Bin[firmware.bin]\n    Agent2 -->|NPM Build| BuildDir[React Build Assets]"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "7. Build Trigger Mechanisms"
      },
      {
        "type": "image",
        "url": "/blog/18-jenkins/genkins9.jpeg",
        "caption": "Trigger Mechanisms"
      },
      {
        "type": "paragraph",
        "text": "Pipelines can be executed using three primary trigger patterns:"
      },
      {
        "type": "list",
        "items": [
          "**SCM Polling:** Jenkins periodically queries the Git repository to look for changes (inefficient, introduces delay).",
          "**Webhook Trigger (Best Practice):** GitHub immediately POSTs to Jenkins upon receiving commits, triggering builds with zero delay.",
          "**Manual Trigger:** Operators trigger workflows manually from the dashboard by selecting 'Build Now'."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "8. Artifact Management"
      },
      {
        "type": "paragraph",
        "text": "Build artifacts are the compiled outputs of a successful pipeline run (e.g. `firmware.bin` for microcontrollers, `.apk` files for mobile apps, or zipped bundle directories). Jenkins archives these outputs, letting developers download specific versions or triggering deployment scripts to flash microcontrollers locally."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "9. Security & Credentials Management"
      },
      {
        "type": "paragraph",
        "text": "Jenkins stores API keys, database passwords, and SSH keys within its encrypted Credentials Manager, preventing sensitive data from leaking in build logs. Security risks include running unverified plugins, leaving controller dashboards exposed without authentication, or leaking environment variable logs."
      },
      {
        "type": "image",
        "url": "/blog/18-jenkins/genkins12.jpeg",
        "caption": "Jenkins Security Managements"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "10. Common Failure Modes"
      },
      {
        "type": "table",
        "headers": [
          "Failure Mode",
          "Root Cause",
          "Engineering Solution"
        ],
        "rows": [
          [
            "Broken pipeline run",
            "Faulty commit, syntax error, or missing dependency packages",
            "Reject pull requests automatically on build failure"
          ],
          [
            "Build queue congestion",
            "Insufficient build agents or resources to handle job volume",
            "Configure dynamic cloud worker agents (e.g. Docker/Kubernetes)"
          ],
          [
            "Plugin incompatibility",
            "Incompatible updates or conflicts between Jenkins versions",
            "Lock plugin versions and test upgrades in a staging server"
          ],
          [
            "Environment drift",
            "Build agent configurations differ from local dev environments",
            "Use Docker containers for all build stages"
          ],
          [
            "Slow builds",
            "Redundant dependencies downloads or heavy unit tests",
            "Implement build caching and parallelize execution stages"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "11. CI/CD Tools Comparison Matrix"
      },
      {
        "type": "table",
        "headers": [
          "Tool Class",
          "Infrastructure Class",
          "Key Strategic Strength"
        ],
        "rows": [
          [
            "Jenkins",
            "Self-Hosted / Hybrid",
            "Extreme plugin flexibility and fine-grained access control"
          ],
          [
            "GitHub Actions",
            "Cloud-Native",
            "Seamless repository integration with zero infrastructure setup"
          ],
          [
            "GitLab CI",
            "Self-Hosted / Cloud",
            "All-in-one DevOps lifecycle integration"
          ],
          [
            "CircleCI",
            "Cloud-Managed",
            "Extremely fast, optimized cloud-hosted pipelines"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "12. Scaling Distributed DevOps Architectures"
      },
      {
        "type": "paragraph",
        "text": "To scale Jenkins in large organizations, developers deploy containerized build nodes. When a pipeline starts, Jenkins requests a Kubernetes cluster to spin up a temporary build agent pod. Once the stage finishes, the pod is destroyed, freeing up cluster memory and computing resources."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "13. Engineering Summary"
      },
      {
        "type": "table",
        "headers": [
          "What Jenkins IS NOT",
          "What Jenkins ENABLES"
        ],
        "rows": [
          [
            "Not a compiler / build tool",
            "Automated, reproducible software delivery"
          ],
          [
            "Not a hosting repository",
            "Continuous testing and quality assurance gates"
          ],
          [
            "Not a production environment",
            "Standardized DevOps and infrastructure automation"
          ],
          [
            "Not a monitoring server",
            "Coordinated firmware, backend, and frontend deployment"
          ]
        ]
      }
    ]
  },
  {
    "id": 19,
    "slug": "gitops",
    "title": "GitOps - Git-Centered Infrastructure & Deployment Model",
    "date": "2026-06-20",
    "author": "Grabber Team",
    "category": "CI/CD",
    "readTime": "5 min",
    "featured": true,
    "excerpt": "Explore GitOps continuous deployment and infrastructure-as-code state reconciliation. Compare pull-based CD models, drift detection loop mechanics, and secrets management in Git.",
    "coverImage": "/blog/19-gitops/gitops.jpeg",
    "content": [
      {
        "type": "heading",
        "level": 1,
        "text": "GitOps - Git-Centered Infrastructure & Deployment Model"
      },
      {
        "type": "image",
        "url": "/blog/19-gitops/gitops1.jpeg",
        "caption": "GitOps Infrastructure Reconciliation Cycle"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "1. Core Idea: Git as the Single Source of Truth"
      },
      {
        "type": "paragraph",
        "text": "GitOps is NOT a continuous integration (CI) tool, NOT just standard Git code storage, and NOT deployment scripting. Instead, it is an operational model where Git acts as the single source of truth for both application and infrastructure states, with automated controller agents continuously reconciling system states with the repository configuration."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "2. What Problem GitOps Solves"
      },
      {
        "type": "image",
        "url": "/blog/19-gitops/gitops2.jpeg",
        "caption": "GitOps Solve Manual Errors"
      },
      {
        "type": "paragraph",
        "text": "In traditional deployments, operators or CI pipelines manually execute push commands to change system state. This creates configuration drift, untraced server modifications, manual errors, and environment inconsistencies. GitOps inverts this flow: developers define the desired state declaratively in Git. An agent running inside the cluster pulls this configuration and automatically adjusts the system, eliminating manual intervention."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "3. GitOps Architecture & Components"
      },
      {
        "type": "paragraph",
        "text": "GitOps structures systems around four primary components:"
      },
      {
        "type": "image",
        "url": "/blog/19-gitops/gitops3.jpeg",
        "caption": "GitOps Architecture"
      },
      {
        "type": "list",
        "items": [
          "**Git Repository:** The system state registry storing declarative manifests, Helm charts, and environment variables.",
          "**CI Pipeline:** Builds code, runs test suites, and pushes Docker images to registries, but does not deploy them.",
          "**GitOps Controller:** An in-cluster controller (e.g. Argo CD, Flux CD) that monitors Git for updates, detects drift, and applies fixes.",
          "**Target System:** The infrastructure platform host (usually a Kubernetes cluster, VM group, or cloud environment)."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "4. The Reconciliation Loop"
      },
      {
        "type": "paragraph",
        "text": "The controller executes a continuous feedback cycle, comparing desired Git configs against actual cluster assets:"
      },
      {
        "type": "mermaid",
        "code": "graph TD\n    GitState[Git Desired State] -->|Monitor| Controller[GitOps Controller]\n    Controller -->|Compare| ActualState[Actual Cluster State]\n    ActualState -->|Drift Detected| Reconcile[Auto Correction Loop]\n    Reconcile -->|Apply Sync| ActualState"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "5. Declarative Infrastructure Model"
      },
      {
        "type": "paragraph",
        "text": "By storing configurations in declarative YAML files, infrastructure is version-controlled just like source code:"
      },
      {
        "type": "image",
        "url": "/blog/19-gitops/gitops6.jpeg",
        "caption": "GitOps Declarative Infrastructure"
      },
      {
        "type": "code",
        "language": "yaml",
        "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: robot-api\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: robot-api"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "6. GitOps in IoT & Robotics Systems"
      },
      {
        "type": "paragraph",
        "text": "In a distributed robotics infrastructure, GitOps is utilized to manage backend APIs, telemetry pipelines, and database deployments. When code updates are merged, CI compiles the changes, updates the GitOps manifest repo, and Argo CD automatically redeploys telemetry workers, Grafana instances, or simulation environments in target clusters:"
      },
      {
        "type": "mermaid",
        "code": "graph TD\n    Repo[Git Config Repository] -->|Poll| Controller[Argo CD Controller]\n    Controller -->|Update Deployment| DB[Telemetry Database]\n    Controller -->|Update Ingestion| Ingest[API Gateway]\n    Controller -->|Sync Settings| UI[Grafana Dashboards]"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "7. CI vs. CD vs. GitOps"
      },
      {
        "type": "table",
        "headers": [
          "Concept Category",
          "Core Responsibility",
          "Deployment Direction"
        ],
        "rows": [
          [
            "Continuous Integration (CI)",
            "Code compiling, styling checks, and unit testing",
            "N/A (does not execute deployments)"
          ],
          [
            "Continuous Delivery (CD)",
            "Compiles and pushes build outputs to servers",
            "Push-based (external tool pushes payload to cluster)"
          ],
          [
            "GitOps Continuous Deployment",
            "Continuous verification and automatic drift correction",
            "Pull-based (in-cluster agent pulls config from Git)"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "8. The Pull-Based Deployment Advantage"
      },
      {
        "type": "paragraph",
        "text": "Unlike traditional CD engines that require administrative credentials to push payloads, GitOps controllers pull configurations from Git. This approach requires no open inbound ports on target clusters, reducing attack surfaces and improving overall security."
      },
      {
        "type": "image",
        "url": "/blog/19-gitops/gitops9.jpeg",
        "caption": "GitOps Security & Governance"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "9. Security & Governance Benefits"
      },
      {
        "type": "table",
        "headers": [
          "Security Risk",
          "GitOps Mitigation Strategy"
        ],
        "rows": [
          [
            "Unauthorized deployment",
            "Managed through Git repository merge permissions and Pull Request approvals"
          ],
          [
            "Manual cluster configuration edits",
            "The GitOps controller automatically overwrites unauthorized manual changes during reconciliation"
          ],
          [
            "Configuration drift",
            "Continuous reconciliation loops compare states and apply drift correction automatically"
          ],
          [
            "Lack of audit trail",
            "Every deployment action, user approval, and configuration update is logged within the Git commit history"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "10. Real-World Failure Modes"
      },
      {
        "type": "table",
        "headers": [
          "Failure Symptom",
          "Likely Root Cause",
          "Engineering Solution"
        ],
        "rows": [
          [
            "Configuration drift loop",
            "An external operator makes conflicting manual edits directly in the cluster",
            "Enforce strict read-only access for developers and block manual kubectl writes"
          ],
          [
            "Deployment failure",
            "Merging invalid configurations (e.g., syntax errors, invalid YAML)",
            "Implement pre-commit syntax validation and CI schema checks on PR branches"
          ],
          [
            "Controller synchronization lag",
            "A massive cluster with too many resources saturates the controller queue",
            "Optimize the polling frequency and divide structures into separate projects"
          ],
          [
            "Plaintext secrets leakage",
            "Committing database passwords or API keys in plaintext to Git",
            "Use encryption tools (e.g., Mozilla Sops, Sealed Secrets) or dynamic vaults"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "11. GitOps vs. Traditional DevOps"
      },
      {
        "type": "table",
        "headers": [
          "Metric",
          "Traditional DevOps",
          "GitOps Model"
        ],
        "rows": [
          [
            "Deployment Source of Truth",
            "CI/CD runner variables and scripts",
            "Declarative Git repositories"
          ],
          [
            "Communication Direction",
            "Push-based",
            "Pull-based"
          ],
          [
            "Rollback Action",
            "Re-run past deployment pipelines",
            "Git revert the configuration commit"
          ],
          [
            "Drift Detection",
            "Manual inspections or alert thresholds",
            "Automated, continuous in-cluster checks"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "12. Engineering Summary"
      },
      {
        "type": "table",
        "headers": [
          "What GitOps IS NOT",
          "What GitOps ENABLES"
        ],
        "rows": [
          [
            "Not a CI pipeline",
            "Fully automated, declarative deployments"
          ],
          [
            "Not a shell script",
            "Simple rollbacks via standard git revert commands"
          ],
          [
            "Not a metrics dashboard",
            "Infrastructure state versioning and reproducible setups"
          ],
          [
            "Not a manual override tool",
            "Strong audit compliance and reduced manual access needs"
          ]
        ]
      }
    ]
  },
  {
    "id": 20,
    "slug": "github_actions",
    "title": "GitHub Actions & Workflows - CI/CD Automation Inside GitHub",
    "date": "2026-06-20",
    "author": "Grabber Team",
    "category": "CI/CD",
    "readTime": "5 min",
    "featured": true,
    "excerpt": "Learn how GitHub Actions drives CI/CD inside your repository. Explore event-driven workflows, reusable actions, secrets management, and robotics firmware pipelines.",
    "coverImage": "/blog/20-github workflow/github1.jpeg",
    "content": [
      {
        "type": "heading",
        "level": 1,
        "text": "GitHub Actions & Workflows — CI/CD Automation Inside GitHub"
      },
      {
        "type": "image",
        "url": "/blog/20-github workflow/github2.jpeg",
        "caption": "GitHub Actions Workflow Architecture"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "1. Core Idea: Built-In Event-Driven Automation"
      },
      {
        "type": "paragraph",
        "text": "GitHub Actions is NOT Git itself, NOT a standalone server like Jenkins, and NOT a programming language. Instead, it is an event-driven automation framework built directly into GitHub that executes declarative workflows in response to repository events such as pushes, pull requests, releases, or cron schedules."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "2. What Problem GitHub Workflows Solve"
      },
      {
        "type": "image",
        "url": "/blog/20-github workflow/github3.jpeg",
        "caption": "Without automation, the software lifecycle is entirely manual"
      },
      {
        "type": "paragraph",
        "text": "Without automation, the software lifecycle is entirely manual: Developer writes code → manually builds it locally → manually runs tests → manually deploys to the server. This introduces human errors, inconsistent build artifacts, forgotten tests, and slow release cycles. GitHub Actions transforms this into an automated pipeline: `Git Push → Workflow Trigger → Auto Build → Auto Test → Auto Deploy`."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "3. Core Architecture & Terminology"
      },
      {
        "type": "paragraph",
        "text": "A GitHub Action workflow is constructed using specific hierarchical components:"
      },
      {
        "type": "image",
        "url": "/blog/20-github workflow/github10.jpeg",
        "caption": "GitHub Actions Workflow Architecture"
      }, 
      {
        "type": "list",
        "items": [
          "**Event:** The trigger that starts the workflow (e.g., `push`, `pull_request`, `release`, `schedule`, `workflow_dispatch`).",
          "**Workflow:** The top-level automation definition, stored as a YAML file in `.github/workflows/`.",
          "**Job:** A major phase of the workflow (e.g., Build, Test, Deploy) running on its own virtual machine.",
          "**Step:** An individual shell command or reusable action executed sequentially within a Job.",
          "**Runner:** The cloud virtual machine (Ubuntu, Windows, macOS) provided by GitHub to execute the steps."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "4. Workflow Execution Model"
      },
      {
        "type": "image",
        "url": "/blog/20-github workflow/github4.jpeg",
        "caption": "GitHub Actions Workflow Architecture"
      },
      {
        "type": "mermaid",
        "code": "graph LR\n    Event[Git Push] -->|Triggers| Workflow[Workflow File]\n    Workflow --> Job1[Run Tests Job]\n    Job1 --> Job2[Build App Job]\n    Job2 --> Job3[Deploy Server Job]\n    Job3 --> Result[Success/Failure Feedback]"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "5. Example: Declarative Workflow Structure"
      },
      {
        "type": "paragraph",
        "text": "Workflows are defined in YAML and placed inside the `.github/workflows/` directory. Below is a standard Node.js CI pipeline:"
      },
      {
        "type": "image",
        "url": "/blog/20-github workflow/github7.jpeg",
        "caption": "Sample"
      },
      {
        "type": "code",
        "language": "yaml",
        "code": "name: CI Pipeline\n\non:\n  push:\n    branches:\n      - main\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout Repository\n        uses: actions/checkout@v4\n\n      - name: Install Dependencies\n        run: npm install\n\n      - name: Run Tests\n        run: npm test\n\n      - name: Build Project\n        run: npm run build"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "6. Important Workflow Triggers"
      },
      {
        "type": "image",
        "url": "/blog/20-github workflow/github9.jpeg",
        "caption": "Triggers"
      },
      {
        "type": "table",
        "headers": [
          "Trigger Syntax",
          "Description"
        ],
        "rows": [
          [
            "`on: push`",
            "Runs whenever code is pushed to specific branches"
          ],
          [
            "`on: pull_request`",
            "Runs validation pipelines before code can be merged"
          ],
          [
            "`on: schedule`",
            "Runs cron-based automation (e.g., nightlies at midnight)"
          ],
          [
            "`on: workflow_dispatch`",
            "Allows manual triggering of the workflow from the GitHub UI"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "7. GitHub Actions in IoT & Robotics Projects"
      },
      {
        "type": "paragraph",
        "text": "For hardware systems like the ESP32 Grabber, Actions can automate the firmware compilation lifecycle: `Git Push → Compile Arduino Code → Run Static Analysis → Create GitHub Release → Attach firmware.bin`. This ensures that every merged PR yields a verified, flashable binary without requiring a local development environment."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "8. Reusable Marketplace Actions"
      },
      {
        "type": "paragraph",
        "text": "Instead of writing raw shell scripts for everything, developers utilize pre-built open-source components from the GitHub Marketplace:"
      },
      {
        "type": "list",
        "items": [
          "**Checkout repo:** `uses: actions/checkout@v4`",
          "**Setup Node:** `uses: actions/setup-node@v4`",
          "**Setup Python:** `uses: actions/setup-python@v5`",
          "**Build Docker Images:** `uses: docker/build-push-action@v5`"
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "9. Secrets & Security Management"
      },
      {
        "type": "paragraph",
        "text": "API Keys, passwords, and tokens must NEVER be hardcoded (e.g., `TOKEN=12345`). Instead, they are stored securely in the repository's 'Secrets and Variables' settings and injected into the workflow at runtime using `${{ secrets.API_KEY }}`. GitHub automatically masks these values in build logs to prevent leakage."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "10. Common Action Mistakes"
      },
      {
        "type": "table",
        "headers": [
          "Bad Practice",
          "Negative Impact",
          "Correct Approach"
        ],
        "rows": [
          [
            "Hardcoding Secrets",
            "Credentials leaked in public Git history",
            "Use GitHub Encrypted Secrets"
          ],
          [
            "Running heavy jobs on every commit",
            "Wasted compute minutes and long queue times",
            "Restrict heavy E2E tests to PR branches or nightlies"
          ],
          [
            "No dependency caching",
            "NPM/Pip dependencies redownload every run (slow)",
            "Utilize `actions/cache` or built-in setup action caches"
          ],
          [
            "Monolithic Workflows",
            "A single massive YAML file that is hard to debug",
            "Split into modular `ci.yml`, `cd.yml`, and `release.yml`"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "11. GitHub Actions vs. Jenkins"
      },
      {
        "type": "table",
        "headers": [
          "Feature",
          "GitHub Actions",
          "Jenkins"
        ],
        "rows": [
          [
            "Setup Complexity",
            "Very Easy (SaaS)",
            "Complex (Requires Server Setup)"
          ],
          [
            "Hosting Architecture",
            "Cloud Built-in (SaaS)",
            "Self-hosted / Private Servers"
          ],
          [
            "Plugin Ecosystem",
            "Extensive (Marketplace Actions)",
            "Massive (Legacy Plugins)"
          ],
          [
            "Maintenance Overhead",
            "Low (Managed)",
            "High (Updates & Security)"
          ],
          [
            "Source Code Integration",
            "Native to GitHub",
            "External Webhooks Required"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "12. Engineering Summary"
      },
      {
        "type": "table",
        "headers": [
          "Terminology",
          "Definition"
        ],
        "rows": [
          [
            "Event",
            "Trigger condition (e.g., push)"
          ],
          [
            "Workflow",
            "The total automation YAML file"
          ],
          [
            "Job",
            "Major lifecycle task (e.g., Build)"
          ],
          [
            "Step",
            "Individual executable operation"
          ],
          [
            "Runner",
            "The virtual machine executing the tasks"
          ],
          [
            "Action",
            "Reusable code component from the marketplace"
          ]
        ]
      }
    ]
  },
  {
    "id": 21,
    "slug": "argo_cd",
    "title": "Argo CD - GitOps Continuous Delivery for Kubernetes",
    "date": "2026-06-20",
    "author": "Grabber Team",
    "category": "CI/CD",
    "readTime": "5 min",
    "featured": true,
    "excerpt": "Dive deep into Argo CD, a Kubernetes-native continuous delivery tool. Explore state reconciliation loops, self-healing deployments, and differences between CI pipelines and CD GitOps.",
    "coverImage": "/blog/21-argocd/argocd.jpeg",
    "content": [
      {
        "type": "heading",
        "level": 1,
        "text": "Argo CD - GitOps Continuous Delivery for Kubernetes"
      },
      {
        "type": "image",
        "url": "/blog/21-argocd/argocd2.jpeg",
        "caption": "Argo CD GitOps Architecture"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "1. Core Idea: Enforcing Desired State"
      },
      {
        "type": "paragraph",
        "text": "Argo CD is NOT Jenkins, NOT GitHub Actions, and NOT Kubernetes itself. It is a GitOps Continuous Delivery (CD) controller that continuously synchronizes a Kubernetes cluster with the desired state declared in Git repositories."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "2. What Problem Argo CD Solves"
      },
      {
        "type": "image",
        "url": "/blog/21-argocd/argocd3.jpeg",
        "caption": "Argo CD GitOps Architecture"
      },
      {
        "type": "paragraph",
        "text": "Traditional deployments rely on push-based pipelines (e.g., `Developer → CI Pipeline → kubectl apply → Cluster Updated`). This approach creates manual deployment bottlenecks, configuration drift (when resources are changed manually outside of Git), poor visibility, and complex rollbacks. Argo CD solves this by reversing the flow: `Git Repository → Argo CD Controller → Kubernetes Cluster`. Rather than 'deploying changes', Argo CD 'declares desired state and continuously enforces it'."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "3. CI vs. CD: Where Argo CD Fits"
      },
      {
        "type": "paragraph",
        "text": "A common misconception is that GitHub Actions competes with Argo CD. In reality, they handle different layers of the pipeline:"
      },
      {
        "type": "table",
        "headers": [
          "Layer",
          "Tools",
          "Core Responsibilities"
        ],
        "rows": [
          [
            "Continuous Integration (CI)",
            "GitHub Actions, Jenkins",
            "Building code, running tests, creating Docker Images"
          ],
          [
            "Continuous Delivery (CD)",
            "Argo CD",
            "Deployment synchronization, rollbacks, state reconciliation"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "4. Architecture & Core Components"
      },
      {
        "type": "list",
        "items": [
          "**Git Repository:** Stores deployment manifests, Helm charts, Kustomize configurations, and ingress rules.",
          "**Argo CD Controller:** An in-cluster agent monitoring Git state and comparing it against actual cluster state.",
          "**Kubernetes Cluster:** The target operational environment.",
          "**Argo CD UI:** A visual dashboard providing application health checks, sync statuses, and rollback tools."
        ]
      },
      {
        "type": "image",
        "url": "/blog/21-argocd/argocd4.jpeg",
        "caption": "Argo CD GitOps Architecture"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "5. Desired State vs. Actual State (The Crucial Concept)"
      },
      {
        "type": "paragraph",
        "text": "The entire GitOps paradigm rests on drift detection. If the **Desired State** in Git dictates `replicas: 3`, but the **Actual State** running in the cluster is only `replicas: 1`, Argo CD detects the discrepancy (drift) and automatically corrects it by spinning up two more pods."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "6. The Reconciliation Loop"
      },
      {
        "type": "mermaid",
        "code": "graph TD\n    Check[Check Git State] --> Compare[Compare with Cluster State]\n    Compare --> Drift{Drift Detected?}\n    Drift -->|Yes| Apply[Apply Corrections to Cluster]\n    Drift -->|No| Wait[Wait Interval]\n    Apply --> Check\n    Wait --> Check"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "7. Deployment Workflow"
      },
      {
        "type": "image",
        "url": "/blog/21-argocd/argocd8.jpeg",
        "caption": "Argo CD GitOps Architecture"
      },
      {
        "type": "paragraph",
        "text": "Deploying code no longer involves `kubectl apply`. The automated flow is: `Developer → Git Push → GitHub Repo Updated → Argo CD Detects Change → Sync Executed → Cluster Updated`. Syncing can be configured as **Manual Sync** (requires a user click in the UI) or **Automatic Sync** (default for robust GitOps systems)."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "8. Supported Deployment Manifests"
      },
      {
        "type": "paragraph",
        "text": "Argo CD natively supports standard Kubernetes formats including raw Kubernetes YAML files (`deployment.yaml`), Helm Charts, Kustomize (environment overlays), and Jsonnet (advanced templating engines)."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "9. Security & Self-Healing Capabilities"
      },
      {
        "type": "image",
        "url": "/blog/21-argocd/argocd8.jpeg",
        "caption": "Argo CD GitOps Architecture"
      },
      {
        "type": "paragraph",
        "text": "Because Argo CD sits inside the cluster pulling from Git, external CI tools no longer require direct cluster admin access, heavily reducing the attack surface. Furthermore, Argo CD features **Self-Healing**. If a malicious actor or mistaken administrator manually deletes a deployment, Argo CD instantly detects the drift against Git and automatically recreates the missing resources."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "10. Rollbacks & Health Monitoring"
      },
      {
        "type": "paragraph",
        "text": "Rollbacks do not require complex database restores. Developers simply execute a `git revert` and `git push`. Argo CD detects the reverted state and downgrades the cluster. During these phases, Argo CD reports health statuses such as Healthy, Progressing, Degraded, Missing, or Unknown."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "11. Common Failure Modes"
      },
      {
        "type": "table",
        "headers": [
          "Failure Symptom",
          "Likely Cause"
        ],
        "rows": [
          [
            "Sync fails to apply",
            "Invalid YAML syntax or broken Helm template files"
          ],
          [
            "Application shows degraded",
            "Tracking the wrong Git branch or failing health checks"
          ],
          [
            "Secrets exposed in Git",
            "Failing to use encryption managers (e.g. SealedSecrets)"
          ],
          [
            "Controller rate limits",
            "Excessive Auto-Sync configs combined with hyper-frequent repository updates"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "12. Argo CD in an IoT Robotics Platform"
      },
      {
        "type": "paragraph",
        "text": "For a robotic ecosystem (ESP32 → MQTT Broker → Backend API → Kubernetes), the DevOps workflow merges tools:"
      },
      {
        "type": "mermaid",
        "code": "graph LR\n    Push[GitHub Code Push] --> Actions[GitHub Actions CI]\n    Actions -->|Build & Push| Docker[Docker Image Registry]\n    Actions -->|Commit SHA| GitOps[GitOps Config Repo]\n    GitOps -->|Reconcile| Argo[Argo CD]\n    Argo -->|Deploy Backend| K8s[Kubernetes Cluster]"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "13. Tool Comparison Summary"
      },
      {
        "type": "table",
        "headers": [
          "Feature / Capability",
          "Argo CD",
          "GitHub Actions",
          "Jenkins"
        ],
        "rows": [
          [
            "Build Code Artifacts",
            "❌ No",
            "✅ Yes",
            "✅ Yes"
          ],
          [
            "Execute Test Suites",
            "❌ No",
            "✅ Yes",
            "✅ Yes"
          ],
          [
            "Deploy Applications",
            "✅ Yes",
            "✅ Yes",
            "✅ Yes"
          ],
          [
            "GitOps Compliance",
            "✅ Yes",
            "❌ No",
            "❌ No"
          ],
          [
            "State Reconciliation",
            "✅ Yes",
            "❌ No",
            "❌ No"
          ],
          [
            "Self-Healing Deployments",
            "✅ Yes",
            "❌ No",
            "❌ No"
          ],
          [
            "Kubernetes Integration Focus",
            "Excellent",
            "Medium",
            "Medium"
          ]
        ]
      }
    ]
  },
  {
    "id": 22,
    "slug": "docker",
    "title": "🐳 Docker — Application Containerization Platform",
    "date": "2026-06-21",
    "author": "Grabber Team",
    "category": "CI/CD",
    "readTime": "5 min",
    "featured": true,
    "excerpt": "Understand how Docker solves the 'works on my machine' syndrome. Dive into container lifecycles, Dockerfile layering, persistent volumes, networking, and microservices for robotics backends.",
    "coverImage": "/blog/software_hero_1781771833467.png",
    "content": [
      {
        "type": "heading",
        "level": 1,
        "text": "🐳 Docker — Application Containerization Platform"
      },
      {
        "type": "image",
        "url": "/blog/software_hero_1781771833467.png",
        "caption": "Docker Containerization Architecture"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "1. Core Idea: Lightweight, Isolated Environments"
      },
      {
        "type": "paragraph",
        "text": "Docker is NOT a virtual machine, NOT Kubernetes, and NOT an operating system. It is a containerization platform that packages an application along with all its runtime dependencies into a lightweight, portable, and isolated unit called a container. This ensures the application runs identically regardless of the host environment."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "2. What Problem Docker Solves"
      },
      {
        "type": "paragraph",
        "text": "Before Docker, developers frequently encountered the \"Works on my machine\" syndrome. An application built locally would crash in production due to different operating systems, missing libraries, or conflicting dependency versions (e.g., Python 3.9 vs. 3.12). Docker eliminates this by bundling the application, libraries, environment variables, and configuration files into a single immutable artifact."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "3. What is a Container?"
      },
      {
        "type": "paragraph",
        "text": "A container is essentially an isolated process running directly on the host operating system's kernel. While a host machine runs generic processes like a web browser or a code editor, Docker allows it to concurrently run isolated environments like a React container, a FastAPI backend, and a PostgreSQL database without them interfering with one another."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "4. Core Components of the Docker Ecosystem"
      },
      {
        "type": "list",
        "items": [
          "**Docker Engine:** The underlying daemon/runtime responsible for building, running, and managing containers.",
          "**Docker Image:** The static blueprint used to instantiate a container (similar to how a Class defines an Object). Examples include `ubuntu:24.04`, `node:22`, or `python:3.12`.",
          "**Container:** The actively running instance of a Docker Image.",
          "**Docker Registry:** A centralized storage repository for Docker Images (e.g., Docker Hub, AWS ECR)."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "5. The Dockerfile: The Blueprint of Containerization"
      },
      {
        "type": "paragraph",
        "text": "The Dockerfile is the most critical file in a Docker project. It is a script containing successive instructions on how to assemble an image:"
      },
      {
        "type": "code",
        "language": "dockerfile",
        "code": "FROM python:3.12\nWORKDIR /app\nCOPY . .\nRUN pip install -r requirements.txt\nCMD [\"python\", \"app.py\"]"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "6. Image Build Process and Layering"
      },
      {
        "type": "paragraph",
        "text": "Docker builds images incrementally using cached 'Layers'. If you change only your application code, Docker reuses the existing base OS and dependency installation layers, dramatically speeding up the build process and optimizing storage."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "7. Port Mapping and Volumes"
      },
      {
        "type": "paragraph",
        "text": "By default, containers are entirely isolated from the host machine:"
      },
      {
        "type": "list",
        "items": [
          "**Port Mapping:** To allow external traffic, host ports must be mapped to container ports (e.g., `docker run -p 8080:80 nginx` forwards traffic from host port 8080 to container port 80).",
          "**Volumes:** Because containers are ephemeral, any data written inside them is lost when they are deleted. Docker Volumes (e.g., `docker volume create postgres-data`) persist data outside the container lifecycle, crucial for databases."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "8. Docker in IoT & Robotics Platforms"
      },
      {
        "type": "paragraph",
        "text": "In a modern robotics stack, microservices power the backend infrastructure. For an ESP32 robot, the backend comprises multiple interacting components. Docker Compose allows developers to define and launch all these interdependent services simultaneously:"
      },
      {
        "type": "code",
        "language": "yaml",
        "code": "services:\n  backend:\n    image: robot-api\n  database:\n    image: postgres\n  grafana:\n    image: grafana\n  mqtt-broker:\n    image: eclipse-mosquitto"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "9. Docker in CI/CD Workflows"
      },
      {
        "type": "paragraph",
        "text": "Docker acts as the standardized packaging format in modern DevOps. A typical GitHub Actions pipeline involves: `Code Push → Build Docker Image → Run Unit Tests in Container → Push Image to Registry → Deploy Container to Kubernetes or cloud VMs`."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "10. Security Considerations & Failure Modes"
      },
      {
        "type": "table",
        "headers": [
          "Failure / Risk",
          "Common Cause",
          "Best Practice Mitigation"
        ],
        "rows": [
          [
            "Container Crashes immediately",
            "Application syntax error or missing runtime environment variables",
            "Check container logs via `docker logs` and validate environment setups"
          ],
          [
            "Port Conflicts",
            "Another host service is already bound to the mapped port (e.g., port 8080)",
            "Map to a different host port or terminate the conflicting process"
          ],
          [
            "Data loss on restart",
            "Missing volume mounts for persistent database storage",
            "Always attach Docker Volumes to stateful services"
          ],
          [
            "Hardcoded Secrets",
            "Baking API keys or passwords directly into the Dockerfile",
            "Inject secrets dynamically at runtime using `.env` files"
          ],
          [
            "Massive Image Sizes",
            "Installing unnecessary dependencies or using heavy base images like full Ubuntu",
            "Use minimal base images like Alpine or slim variants"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "11. Docker vs. Virtual Machines"
      },
      {
        "type": "table",
        "headers": [
          "Feature",
          "Docker Containers",
          "Virtual Machines (VMs)"
        ],
        "rows": [
          [
            "Architecture",
            "Shares the host OS kernel",
            "Runs a complete, heavy guest OS"
          ],
          [
            "Startup Time",
            "Milliseconds to Seconds",
            "Minutes"
          ],
          [
            "Resource Usage",
            "Extremely Low (Lightweight)",
            "High (Heavy RAM and CPU overhead)"
          ],
          [
            "Portability",
            "High (Runs identically anywhere)",
            "Medium (Tied to hypervisor configs)"
          ],
          [
            "Isolation Level",
            "Process-level isolation",
            "Hardware-level isolation"
          ]
        ]
      }
    ]
  },
  {
    "id": 23,
    "slug": "kubernetes",
    "title": "Kubernetes (K8s) — Container Orchestration Platform",
    "date": "2026-06-21",
    "author": "Grabber Team",
    "category": "CI/CD",
    "readTime": "6 min",
    "featured": true,
    "excerpt": "Explore Kubernetes container orchestration. Learn about the Control Plane architecture, Pod lifecycles, Deployments, Load Balancing Services, and GitOps deployments for robotics platforms.",
    "coverImage": "/blog/software_hero_1781771833467.png",
    "content": [
      {
        "type": "heading",
        "level": 1,
        "text": "Kubernetes (K8s) — Container Orchestration Platform"
      },
      {
        "type": "image",
        "url": "/blog/software_hero_1781771833467.png",
        "caption": "Kubernetes Cluster Architecture"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "1. Core Idea: Automating Container Operations at Scale"
      },
      {
        "type": "paragraph",
        "text": "Kubernetes is NOT Docker, NOT a virtual machine, and NOT a cloud provider. It is a container orchestration platform that automates the deployment, scaling, networking, recovery, and management of containerized applications across massive clusters of machines."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "2. What Problem Kubernetes Solves"
      },
      {
        "type": "paragraph",
        "text": "While Docker solves how to run a single container, production systems are vastly more complex. Managing 100 containers across 10 servers manually is impossible. Without Kubernetes, there is no automatic recovery if a container crashes, manual load balancing is required, and rolling updates are extremely difficult. Kubernetes automatically handles application scaling, networking, cluster management, and self-healing."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "3. High-Level Cluster Architecture"
      },
      {
        "type": "mermaid",
        "code": "graph TD\n    CP[Control Plane] --> W1[Worker Node 1]\n    CP --> W2[Worker Node 2]\n    W1 --> P1[Pod]\n    W1 --> P2[Pod]\n    W2 --> P3[Pod]"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "4. Control Plane Components"
      },
      {
        "type": "paragraph",
        "text": "The Control Plane is the brain of the cluster, responsible for scheduling, monitoring, and maintaining the global state. It consists of:"
      },
      {
        "type": "list",
        "items": [
          "**API Server:** The front door. All `kubectl` commands interact directly with the API server.",
          "**ETCD:** A highly available, distributed key-value database storing the entire cluster configuration and state.",
          "**Scheduler:** Decides which Worker Node will host a newly created Pod based on available resources.",
          "**Controller Manager:** Continuously monitors the cluster, comparing the actual state against the desired state, taking corrective actions if drift occurs."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "5. What is a Pod?"
      },
      {
        "type": "paragraph",
        "text": "A Pod is the smallest deployable compute unit in Kubernetes. Unlike Docker where you run a single container, Kubernetes schedules Pods. A Pod usually contains one main container (e.g., a FastAPI server), but can also run alongside auxiliary sidecar containers (e.g., a localized logging agent)."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "6. Deployments & Scaling"
      },
      {
        "type": "paragraph",
        "text": "Pods are ephemeral; if they die, they die. To guarantee availability, you create a **Deployment**. A Deployment manages Pod creation, scaling, updates, and recovery. For example, declaring `replicas: 3` in a Deployment YAML guarantees that Kubernetes will always keep exactly 3 instances of that Pod running."
      },
      {
        "type": "code",
        "language": "yaml",
        "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-deployment\nspec:\n  replicas: 3"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "7. Services, Load Balancing, and Ingress"
      },
      {
        "type": "paragraph",
        "text": "Because Pods frequently die and restart on different nodes, their IP addresses are constantly changing. A **Service** solves this by providing a stable network endpoint that automatically load balances traffic across all available Pods. To expose these services to the public internet (e.g., `robot.example.com`), Kubernetes uses an **Ingress**, which acts as an advanced reverse proxy and TLS terminator."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "8. Persistent Volumes & Stateful Data"
      },
      {
        "type": "paragraph",
        "text": "Because containers are temporary, any data written inside a Pod is lost when it crashes. For databases like PostgreSQL or MongoDB, Kubernetes uses **Persistent Volumes (PV)**. A PV mounts external storage directly into the Pod, ensuring data survives Pod restarts."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "9. Self-Healing & Rolling Updates"
      },
      {
        "type": "paragraph",
        "text": "If a Worker Node goes offline, Kubernetes immediately detects the missing Pods and reschedules them onto healthy nodes (Self-Healing). When deploying new code, Kubernetes performs **Rolling Updates**, gradually terminating old Pods and spinning up new ones to ensure zero downtime. If the new deployment has a bug, `kubectl rollout undo` immediately reverts to the previous stable state."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "10. Security: RBAC and Secrets"
      },
      {
        "type": "paragraph",
        "text": "Access to the API server is strictly governed by **Role-Based Access Control (RBAC)**, defining exactly who (or what pod) can perform specific actions. Sensitive configurations like API keys and database passwords must never be stored in plain text YAML; they are securely injected into Pods using Kubernetes **Secrets**."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "11. Kubernetes in an IoT Robotics Platform"
      },
      {
        "type": "paragraph",
        "text": "For a distributed robotics project, the edge hardware (ESP32) communicates via MQTT. The backend infrastructure running inside Kubernetes handles everything else:"
      },
      {
        "type": "list",
        "items": [
          "**Pod 1:** MQTT Message Broker (Mosquitto)",
          "**Pod 2:** Python FastAPI Telemetry Ingestion Service",
          "**Pod 3:** Stateful PostgreSQL Database (with Persistent Volumes)",
          "**Pod 4:** Grafana Dashboard (exposed via Ingress)",
          "**Pod 5:** Prometheus Metrics Scraper"
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "12. Docker vs. Kubernetes"
      },
      {
        "type": "table",
        "headers": [
          "Feature",
          "Docker",
          "Kubernetes"
        ],
        "rows": [
          [
            "Primary Function",
            "Creates and packages isolated containers",
            "Orchestrates and manages clusters of containers"
          ],
          [
            "Application Scaling",
            "❌ Manual execution",
            "✅ Automated ReplicaSets"
          ],
          [
            "Self-Healing",
            "❌ Manual restart required",
            "✅ Automated recreation"
          ],
          [
            "Rolling Updates",
            "❌ Manual replacement",
            "✅ Automated zero-downtime updates"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "13. Common Failure Modes"
      },
      {
        "type": "table",
        "headers": [
          "Error State",
          "Likely Cause"
        ],
        "rows": [
          [
            "CrashLoopBackOff",
            "Application inside the Pod keeps crashing due to fatal errors or misconfigurations"
          ],
          [
            "ImagePullBackOff",
            "Kubernetes cannot pull the specified image due to typos or private registry auth failures"
          ],
          [
            "Insufficient Resources",
            "The cluster lacks the required CPU or Memory to schedule the Pod"
          ],
          [
            "ETCD Failure",
            "Control Plane database corruption; can bring down the entire cluster"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "14. The Modern Deployment Pipeline"
      },
      {
        "type": "mermaid",
        "code": "graph LR\n    Dev[Developer] --> Git[GitHub PR]\n    Git --> CI[GitHub Actions CI]\n    CI -->|Build Image| Hub[Docker Registry]\n    CI -->|Update YAML| Repo[GitOps Repo]\n    Repo -->|Reconcile| Argo[Argo CD]\n    Argo -->|Deploy| K8s[Kubernetes Cluster]"
      }
    ]
  }
];

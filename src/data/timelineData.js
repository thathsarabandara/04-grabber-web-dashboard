export const projectTimeline = [
  {
    id: 1,
    day: 1,
    title: 'Manual Control via Joysticks',
    subtitle: 'First step in building a responsive robotic grabbing system',
    description: 'Today focuses on establishing direct human-to-machine control using dual joysticks. This stage is not about intelligence yet — it is about precision, stability, and control reliability.',
    implemented: [
      'Real-time joystick input mapping',
      'Bidirectional motor control interface',
      'Smooth actuator response calibration',
      'Low-latency control loop design'
    ],
    context: 'Building the foundation for: Semi-autonomous gripping, Vision-based control, and AI-assisted manipulation.',
    tags: ['#Robotics', '#Engineering', '#GrabberProject'],
    video: 'https://youtu.be/s2zgFPOAeLU?si=24-UptYcBjyU--zF'
  },
  {
    id: 2,
    day: 2,
    title: 'Mobile Application Foundation',
    subtitle: 'Taking the next step toward a smarter and more accessible robotic control system',
    description: 'Today’s milestone was developing the initial Flutter mobile application template, creating the foundation for future robot control, monitoring, and intelligent features.',
    implemented: [
      'Flutter project architecture setup',
      'Responsive UI layout design',
      'Navigation structure preparation',
      'Control screen wireframe creation',
      'Scalable code organization for future development'
    ],
    context: 'A well-designed application foundation makes it easier to integrate Bluetooth connectivity, Live camera streaming, Joystick controls, Robotic arm monitoring, and AI-powered features.',
    tags: ['#Flutter', '#MobileDevelopment', '#Robotics', '#SoftwareEngineering', '#IoT'],
    video: 'https://youtu.be/KqTVIFWJg_0?si=2GOjT2jbtCSDUtPK'
  },
  {
    id: 3,
    day: 3,
    title: 'Web Dashboard & Blog Foundation',
    subtitle: 'Expanding the Grabber ecosystem beyond hardware and mobile',
    description: 'Creating a React + Tailwind CSS web application that will serve as the central hub for monitoring, management, documentation, and future AI-powered features.',
    implemented: [
      'React project setup',
      'Tailwind CSS integration',
      'Responsive dashboard layout',
      'Navigation and page structure',
      'Blog template for project updates',
      'Reusable UI component foundation'
    ],
    context: 'Future Dashboard Features: Robot status monitoring, Live camera feeds, Remote control interface, Analytics and performance tracking, AI vision insights, Project documentation & updates.',
    tags: ['#ReactJS', '#TailwindCSS', '#WebDevelopment', '#Robotics'],
    video: 'https://youtu.be/NcwvMj28dTk?si=FuWjGD7lzqX1R2ec'
  },
  {
    id: 4,
    day: 4,
    title: 'Bluetooth Mobile Control',
    subtitle: 'A major milestone achieved today — the robotic arm can now be controlled directly from the mobile application via Bluetooth!',
    description: 'What started as a joystick-controlled prototype is now evolving into a connected robotic system.',
    implemented: [
      'Bluetooth communication between mobile app and robot',
      'Real-time command transmission',
      'Mobile control interface integration',
      'Movement command processing',
      'Stable device pairing and connectivity'
    ],
    flow: 'User Input -> Flutter App -> Bluetooth Module -> Robot Arm Movement',
    context: 'This integration bridges the gap between hardware and software, enabling wireless control and creating the foundation for future intelligent features.',
    tags: ['#Robotics', '#Flutter', '#Bluetooth', '#MobileDevelopment', '#IoT'],
    video: 'https://youtu.be/ZYT2Tuhk8O4?si=FDlayFaRPqZn_a1W'
  },
  {
    id: 5,
    day: 5,
    title: 'API Gateway & Authentication Infrastructure',
    subtitle: 'Building the backend foundation that will power secure communication',
    description: 'A robotic platform is more than hardware and control systems—it also requires a secure, scalable, and production-ready backend architecture.',
    implemented: [
      'Centralized request routing & scalable backend foundation',
      'User registration & OTP verification workflow',
      'Profile image upload & management',
      'Device session management & tracking'
    ],
    flow: 'Mobile App <-> API Gateway <-> Auth Service <-> Database',
    context: 'This infrastructure will support future capabilities such as Remote robot access, Cloud synchronization, Multi-user management, and AI-powered services.',
    tags: ['#BackendDevelopment', '#APIGateway', '#Authentication', '#SystemDesign'],
    video: 'https://youtu.be/iKOU6gbL75o?si=TCZv7Q8QfUoElO5G'
  },
  {
    id: 6,
    day: 6,
    title: 'Robot Management & Secure Pairing',
    subtitle: 'Building the identity and ownership layer for the Grabber ecosystem',
    description: 'As the number of connected robots grows, secure device ownership becomes just as important as the hardware itself.',
    implemented: [
      'Automatic robot registration via ESP32',
      'Owner-to-robot pairing mechanism & secure claiming',
      'Robot information dashboard & hardware metadata',
      'Secure unpairing process & access revocation'
    ],
    flow: 'ESP32 Robot -> Registration Server -> Pairing Service -> Verified Owner',
    context: 'This infrastructure creates the foundation for Multi-robot environments, Remote robot management, Device ownership control, and Cloud-connected robotics.',
    tags: ['#Robotics', '#IoT', '#SystemDesign', '#CloudComputing', '#CyberSecurity'],
    video: 'https://youtu.be/AIpGv0F3Nn4?si=efa0yv8hH1euN4Uc'
  },
  {
    id: 7,
    day: 7,
    title: 'Biometric Authentication Integration',
    subtitle: 'Making access to the Grabber ecosystem faster, smarter, and more secure',
    description: 'Today’s milestone focused on integrating biometric authentication into the mobile application, allowing users to securely access their accounts using their device’s built-in security features.',
    implemented: [
      'Fingerprint & Face ID biometric support',
      'Secure local credential validation',
      'One-tap fast-login user experience',
      'Device-level identity verification & protection'
    ],
    context: 'Biometric authentication enables users to securely access robot management, monitoring, and control features without repeatedly entering credentials.',
    tags: ['#Flutter', '#MobileDevelopment', '#BiometricAuthentication', '#CyberSecurity', '#Robotics', '#IoT'],
    video: 'https://youtu.be/-YNoT9tjJuQ?si=MlGPSGUgLPQ_kS_v'
  },
  {
    id: 8,
    day: 8,
    title: 'Internet-Based Robot Control & Live Status Monitoring',
    subtitle: 'Remote operation and real-time state tracking from anywhere over the internet',
    description: 'A major leap forward today! The Grabber robot is no longer limited by Bluetooth range—it can now be controlled remotely over the internet from anywhere with a connection.',
    implemented: [
      'Internet-based remote robot control & communication',
      'Real-time command transmission & latency optimization',
      'Live robot status monitoring (Online, Idle, Task, Offline)',
      'Virtual joystick, individual joint & speed controls',
      'Emergency stop and home pose recovery functions'
    ],
    context: 'Remote control is one of the most important milestones in the development of a connected robotics platform, laying the foundation for AI-assisted manipulation, live streaming, and cloud management.',
    tags: ['#Robotics', '#IoT', '#ESP32', '#Flutter', '#MobileDevelopment', '#CloudComputing', '#RemoteControl'],
    video: 'https://youtu.be/BsGxyvHmtrQ?si=2yrVfupgvqBc0pBn'
  },
  {
    id: 9,
    day: 9,
    title: 'Live Camera Telemetry with ESP32-CAM',
    subtitle: 'Visual feedback and real-time environment stream telemetry',
    description: 'Today, the Grabber project gained its eyes. A significant milestone was achieved by integrating the ESP32-CAM module to provide real-time visual feedback from the robot arm, allowing operators to see what the robot sees while controlling it remotely.',
    implemented: [
      'Live camera streaming with ESP32-CAM module integration',
      'Low-latency remote video feed viewing via mobile application',
      'Robot camera status & connection telemetry tracking',
      'Situational awareness & precision control improvements'
    ],
    context: 'Remote control becomes dramatically more effective when combined with live visual feedback. This establishes the foundation for future AI object detection, autonomous picking, and vision-assisted robotic manipulation.',
    tags: ['#Robotics', '#ESP32CAM', '#ComputerVision', '#IoT', '#EmbeddedSystems', '#Flutter', '#MobileDevelopment', '#Telemetry'],
    video: 'https://youtu.be/nhmpPPoEyAE?si=ZUY9j0dzEEaKzkLe'
  },
  {
    id: 10,
    day: 10,
    title: 'Advanced Telemetry & Analytics Platform',
    subtitle: 'Comprehensive robot health profiling and power analytics',
    description: 'Today marked a major evolution in the Grabber ecosystem—from simple robot control to comprehensive robot intelligence and health monitoring. The platform can now collect, process, and visualize real-time telemetry data.',
    implemented: [
      'Live battery percentage, voltage & current tracking',
      'Real-time joint angle and servo position visualization',
      'Power analytics tracking (motion vs power consumption)',
      'Posture signature system for state identification',
      'Kinematic synchronization and multi-axis movement tracking'
    ],
    context: 'Most hobby robots can move. Few can explain how much power they consume, what their joints are doing, and how efficiently they operate. This telemetry layer is the foundation for predictive maintenance, recorded task execution, and AI-assisted diagnostics.',
    tags: ['#Robotics', '#IoT', '#ESP32', '#Telemetry', '#DataAnalytics', '#PowerMonitoring', '#BatteryManagement', '#Kinematics'],
    video: 'https://youtu.be/3njfBVSZCQc?si=rTj1mnL_NeoFbMu5'
  },
  {
    id: 11,
    day: 11,
    title: 'Pose & Sequence Recording System',
    subtitle: 'Programmable robotic automation and motion sequence recording',
    description: 'Today, the Grabber robot learned how to remember. A major productivity feature was added to the platform: the ability to record, save, and replay robot poses and motion sequences.',
    implemented: [
      'Capture current robot arm position and save joint angles',
      'Record complete multi-step movement sequences & workflows',
      'Sequence library management (saving, editing, renaming)',
      'Interactive playback controls (execute, pause, stop)',
      'Automated task execution without manual reconfiguration'
    ],
    context: 'This is the first step from robot control to robot automation. Instead of manually telling the robot how to move every time, users can now create reusable behaviors and task sequences that can be executed whenever needed.',
    tags: ['#Robotics', '#RobotArm', '#Automation', '#IoT', '#EmbeddedSystems', '#Flutter', '#MotionControl'],
    video: 'https://youtu.be/rEnmqw6ngEE?si=ZcAtDi4SNrqOPgZc'
  },
  {
    id: 12,
    day: 12,
    title: 'Media Capture & Gallery Management',
    subtitle: 'Media capture and gallery management from the live camera feed',
    description: 'Today, the Grabber platform gained the ability to capture, store, and manage visual data directly from the robot\'s live camera feed, preserving important moments for documentation.',
    implemented: [
      'One-tap photo snapshot capture from live feed',
      'Remote video recording sessions and session-based storage',
      'Centralized media library gallery dashboard management',
      'Visual operations documentation and dataset collection tools'
    ],
    context: 'Visual data is one of the most valuable sources of information in robotics. By enabling image and video capture, the platform can now review completed tasks and build datasets for future AI models.',
    tags: ['#Robotics', '#ESP32CAM', '#ComputerVision', '#IoT', '#EmbeddedSystems', '#Flutter', '#VideoRecording'],
    video: 'https://youtu.be/Mtr7tXCaWqA?si=LGZvmyrUnTno5Iao'
  },
  {
    id: 13,
    day: 13,
    title: 'Real-Time Object Recognition with YOLO',
    subtitle: 'Integrating AI vision and low-latency multi-object classification',
    description: 'Today, the Grabber robot became capable of understanding its surroundings. A major AI milestone was achieved by integrating YOLO for real-time object detection and confidence scoring.',
    implemented: [
      'YOLO-based real-time object detection & localization',
      'Live camera stream continuous inference pipeline',
      'Confidence score estimation and bounding box overlays',
      'Vision-assisted robot control and target selection'
    ],
    context: 'Until now, the robot could move and see. Now it can understand what it\'s looking at, opening the door for autonomous object picking, inventory assistance, and smart manipulation.',
    tags: ['#Robotics', '#YOLO', '#ComputerVision', '#ArtificialIntelligence', '#MachineLearning', '#DeepLearning', '#ESP32CAM'],
    video: 'https://youtu.be/R6CDGdMlOhk?si=Eox-8WRbPfK9rz7c'
  },
  {
    id: 14,
    day: 14,
    title: 'Real-Time Face Recognition with InsightFace',
    subtitle: 'Facial embedding recognition and identity-aware robot control',
    description: 'Today, the Grabber platform reached another major AI milestone by integrating InsightFace for real-time face recognition, matching face embeddings to a registered user database.',
    implemented: [
      'Real-time face recognition and user identification',
      'InsightFace embedding extraction and distance database matching',
      'Identity verification workflow and secure access permissions',
      'Low-latency facial detection stream overlays'
    ],
    context: 'The robot is no longer limited to understanding what it sees—it can now recognize who it sees. This capability unlocks personalized access, safety permissions, and personalized task execution.',
    tags: ['#Robotics', '#InsightFace', '#FaceRecognition', '#ComputerVision', '#ArtificialIntelligence', '#MachineLearning', '#DeepLearning'],
    video: 'https://youtu.be/uhraI87DmLc?si=ebPFvUkZofQYcbD3'
  },
  {
    id: 15,
    day: 15,
    title: 'Hand Gesture Control with MediaPipe',
    subtitle: 'Natural contactless human-robot interaction using hand gestures',
    description: 'Today, the Grabber project took another step toward natural human-robot interaction by enabling hand gesture control using MediaPipe, interpreting 21 hand landmarks.',
    implemented: [
      'Real-time hand tracking and 21 landmark coordinate detection',
      'Gesture interpretation and command translation engine',
      'Contactless robot control translation interface',
      'Low-latency responsive gesture-driven arm movements'
    ],
    context: 'Until now, the robot responded to buttons, joysticks, and sliders. Now it can respond to human gestures, making interaction more natural and intuitive—laying the foundation for touch-free collaborative robotics.',
    tags: ['#Robotics', '#MediaPipe', '#HandTracking', '#GestureRecognition', '#ComputerVision', '#ArtificialIntelligence', '#IoT'],
    video: 'https://youtu.be/ag_uQFBAfuA?si=R9ekL-YdmJFBSJVW'
  }
];

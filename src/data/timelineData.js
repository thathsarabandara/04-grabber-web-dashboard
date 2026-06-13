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
    flow: 'Joystick movement -> Signal processing -> Gripper actuation',
    context: 'Building the foundation for: Semi-autonomous gripping, Vision-based control, and AI-assisted manipulation.',
    tags: ['#Robotics', '#Engineering', '#GrabberProject'],
    video: '/vlog/Day_01.mp4'
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
    flow: 'Mobile App -> Communication Layer -> Grabber System',
    context: 'A well-designed application foundation makes it easier to integrate Bluetooth connectivity, Live camera streaming, Joystick controls, Robotic arm monitoring, and AI-powered features.',
    tags: ['#Flutter', '#MobileDevelopment', '#Robotics', '#SoftwareEngineering', '#IoT'],
    video: '/vlog/Day_02.mp4'
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
    flow: 'Mobile App <-> Web Dashboard <-> API Layer <-> Grabber System',
    context: 'Future Dashboard Features: Robot status monitoring, Live camera feeds, Remote control interface, Analytics and performance tracking, AI vision insights, Project documentation & updates.',
    tags: ['#ReactJS', '#TailwindCSS', '#WebDevelopment', '#Robotics'],
    video: '/vlog/Day_03.mp4'
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
    video: '/vlog/Day_04.mp4'
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
    video: '/vlog/Day_05.mp4'
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
    video: '/vlog/Day_06.mp4'
  }
];

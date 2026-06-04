export const blogPosts = [
  {
    id: 7,
    slug: 'esp32-microcontroller',
    title: 'The Brain of the Operation: Understanding the ESP32',
    date: 'June 04, 2026',
    author: 'Hardware Lead',
    category: 'Hardware',
    readTime: '6 min',
    featured: true,
    excerpt: 'The ESP32 serves as the central orchestrator, handling communication and processing for the robotic ecosystem.',
    coverImage: '/blog/esp32.png',
    content: [
      { type: 'paragraph', text: 'The ESP32 is a low-cost, low-power system on a chip (SoC) microcontroller with integrated Wi-Fi and dual-mode Bluetooth. Developed by Espressif Systems, it has become a staple in IoT, robotics, and smart home applications thanks to its powerful processing capabilities and extensive peripheral support.' },
      { type: 'heading', level: 2, text: 'Key Specifications' },
      { type: 'paragraph', text: 'Processor: Tensilica Xtensa Dual-Core 32-bit LX6 microprocessor (160/240 MHz). Memory: 520 KB SRAM. Wireless: Wi-Fi 802.11 b/g/n and Bluetooth v4.2 BR/EDR and BLE. Power: 3.3V logic (NOT 5V tolerant).' },
      { type: 'heading', level: 2, text: 'Role in the Grabber Project' },
      { type: 'paragraph', text: 'In the context of the Grabber project, the ESP32 serves as the "brain". It handles wireless communication to receive commands and stream telemetry. It interfaces with sensors, motor drivers, and processes incoming joystick data on the fly.' }
    ]
  },
  {
    id: 8,
    slug: 'pca9685-pwm-driver',
    title: 'Expanding Control: The PCA9685 PWM Servo Driver',
    date: 'June 04, 2026',
    author: 'Hardware Lead',
    category: 'Hardware',
    readTime: '5 min',
    featured: true,
    excerpt: 'When building complex robotic arms, standard microcontrollers quickly run out of pins. Enter the PCA9685.',
    coverImage: '/blog/pca9685.png',
    content: [
      { type: 'paragraph', text: 'When building complex robotic arms, you quickly run out of pins and timer resources on standard microcontrollers. Enter the PCA9685, a 16-channel, 12-bit PWM controller that communicates seamlessly over the I2C bus. By offloading PWM generation to this dedicated chip, it frees up processing power on your main board.' },
      { type: 'heading', level: 2, text: 'Technical Specifications' },
      { type: 'paragraph', text: '16 independent PWM channels with 12-bit resolution. I2C bus interface. Adjustable PWM frequency (usually set to 50Hz for servos). Addressable, allowing up to 62 boards to be chained.' },
      { type: 'heading', level: 2, text: 'Why We Use It' },
      { type: 'paragraph', text: 'It offloads the ESP32 to prevent jitter, provides massive servo expansion for all robotic joints, and offers crucial power isolation with a dedicated terminal block for servo power (V+).' }
    ]
  },
  {
    id: 9,
    slug: 'rc-servomotors',
    title: 'The Muscles of the Machine: RC Servomotors',
    date: 'June 04, 2026',
    author: 'Hardware Lead',
    category: 'Hardware',
    readTime: '7 min',
    featured: true,
    excerpt: 'A deep dive into the mechanical muscles behind our robotic arm and how they interpret PWM signals.',
    coverImage: '/blog/servo.png',
    content: [
      { type: 'paragraph', text: 'A servo is the mechanical muscle behind most hobbyist and educational robotics projects. It is a rotary or linear actuator that allows for precise control of angular position, velocity, and acceleration. A standard RC servo packs a DC motor, a gear reduction unit, a position-sensing potentiometer, and a control circuit into a single compact housing.' },
      { type: 'heading', level: 2, text: 'How They Work' },
      { type: 'paragraph', text: 'Servos listen for a PWM signal. The width of the high pulse dictates the target angle (typically 1.0ms for 0 degrees, 1.5ms for 90 degrees, and 2.0ms for 180 degrees at 50Hz frequency).' },
      { type: 'heading', level: 2, text: 'Servos in the Grabber Project' },
      { type: 'paragraph', text: 'High-torque metal gear servos (like the MG996R) are deployed at the base and shoulder. Lighter servos (like the SG90) actuate the wrist and gripper. Always be cautious of high stall currents which can quickly overheat the motor or reset your microcontroller.' }
    ]
  },
  {
    id: 10,
    slug: 'analog-joysticks',
    title: 'Human in the Loop: Analog Joysticks',
    date: 'June 04, 2026',
    author: 'Hardware Lead',
    category: 'Hardware',
    readTime: '6 min',
    featured: true,
    excerpt: 'How analog joysticks provide fine-grained, intuitive, two-dimensional control over our robotics.',
    coverImage: '/blog/joystick.png',
    content: [
      { type: 'paragraph', text: 'When you want intuitive, proportional control over a robot, digital buttons don\'t cut it. Analog joysticks provide fine-grained, two-dimensional input, allowing a user to control not just the direction of movement, but the speed as well.' },
      { type: 'heading', level: 2, text: 'Under the Hood' },
      { type: 'paragraph', text: 'A typical module consists of two potentiometers for the X and Y axes, a push button for the Z axis, and a centering spring. Electrically, they act as voltage dividers, which the microcontroller reads via its Analog-to-Digital Converter.' },
      { type: 'heading', level: 2, text: 'Role in the Grabber Project' },
      { type: 'paragraph', text: 'Joysticks provide the manual override interface. We use an incremental control scheme where joystick deflection controls the velocity of the joint, rather than its absolute angle. Implementing software deadzones is critical to prevent drift when the stick is released.' }
    ]
  }
];

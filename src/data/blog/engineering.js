export const engineeringPosts = [
  {
    "id": 12,
    "slug": "interrupts_isr",
    "title": "Safety First - Interrupts & ISRs (Embedded Systems / Microcontrollers)",
    "date": "2026-06-18",
    "author": "Grabber Team",
    "category": "Engineering",
    "readTime": "7 min",
    "featured": true,
    "excerpt": "Hardware-triggered events that immediately pause normal program execution, execute a special function (ISR), then resume the previous state.",
    "coverImage": "/blog/12-safty/isr.jpeg",
    "content": [
      {
        "type": "heading",
        "level": 1,
        "text": "Safety First — Interrupts & ISRs"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Core Idea"
      },
      {
        "type": "image",
        "url": "/blog/12-safty/isr2.jpeg",
        "caption": "Interrupts Concept"
      },
      {
        "type": "list",
        "items": [
          "Interrupts are NOT background threads.",
          "Interrupts are NOT multitasking in the OS sense.",
          "Interrupts are NOT optional optimizations."
        ]
      },
      {
        "type": "blockquote",
        "text": "[!IMPORTANT] **Interrupts are:** Hardware-triggered events that immediately pause normal program execution, execute a special function (ISR), then resume the previous state."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "1. Why Interrupts Exist"
      },
      {
        "type": "paragraph",
        "text": "Without interrupts, a microcontroller CPU must continuously check if a button is pressed, a sensor has updated data, or a network packet has arrived. This technique is called polling. Polling introduces several major problems:"
      },
      {
        "type": "list",
        "items": [
          "**Wastes CPU Cycles:** The CPU runs loops endlessly checking hardware state, preventing other tasks from running.",
          "**High Power Consumption:** The processor remains in an active state constantly rather than sleeping.",
          "**Delayed Response:** Polling rate limits how quickly external events are processed.",
          "**Inefficient for Real-Time Systems:** Transient electrical signals might be missed if the CPU is busy elsewhere."
        ]
      },
      {
        "type": "paragraph",
        "text": "With interrupts, the event notifies the CPU instantly. CPU execution pauses, the Interrupt Service Routine (ISR) runs, and the normal program resumes execution immediately after."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "2. Interrupt Flow (Execution Model)"
      },
      {
        "type": "paragraph",
        "text": "The execution model of an interrupt follows a strict hardware sequence:"
      },
      {
        "type": "image",
        "url": "/blog/12-safty/isr1.jpeg",
        "caption": "Interrupts flow"
      },
      {
        "type": "list",
        "items": [
          "1. Normal program runs.",
          "2. Hardware event occurs.",
          "3. CPU pauses execution.",
          "4. CPU saves context (registers, Program Counter).",
          "5. CPU jumps to ISR (Interrupt Service Routine) address.",
          "6. ISR executes.",
          "7. CPU restores context.",
          "8. Program resumes normal execution."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "3. What is an ISR?"
      },
      {
        "type": "paragraph",
        "text": "An ISR (Interrupt Service Routine) is a special hardware-triggered callback function executed when its associated interrupt occurs. An example GPIO interrupt ISR:"
      },
      {
        "type": "code",
        "language": "cpp",
        "code": "void IRAM_ATTR buttonISR() {\n    flag = true;\n}"
      },
      {
        "type": "blockquote",
        "text": "[!IMPORTANT] **Key Rule:** An ISR must always be fast, minimal, and deterministic."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "4. Critical ISR Design Rules"
      },
      {
        "type": "table",
        "headers": [
          "❌ DO NOT",
          "✅ DO"
        ],
        "rows": [
          [
            "Use delay() or blocking commands",
            "Set simple boolean flags"
          ],
          [
            "Perform heavy mathematical computation",
            "Read minimal input data"
          ],
          [
            "Allocate memory (malloc / new)",
            "Store lightweight timestamps"
          ],
          [
            "Call slow I/O (Serial.print inside many MCUs)",
            "Signal RTOS tasks"
          ],
          [
            "Block execution in critical paths",
            "Exit as fast as possible"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "5. Interrupt vs Polling"
      },
      {
        "type": "table",
        "headers": [
          "Feature",
          "Interrupts",
          "Polling"
        ],
        "rows": [
          [
            "CPU usage",
            "Low",
            "High"
          ],
          [
            "Response time",
            "Fast",
            "Delayed"
          ],
          [
            "Efficiency",
            "High",
            "Low"
          ],
          [
            "Complexity",
            "Medium",
            "Simple"
          ],
          [
            "Real-time suitability",
            "Excellent",
            "Poor"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "6. Types of Interrupts"
      },
      {
        "type": "list",
        "items": [
          "**(A) External Interrupts:** Triggered by changing states on external GPIO pins (e.g., button press, encoder pulse, rising/falling edge).",
          "**(B) Timer Interrupts:** Triggered periodically by hardware timers (e.g., every 1 ms, every 1 second).",
          "**(C) Peripheral Interrupts:** Triggered by internal modules (e.g., UART receive buffer full, ADC conversion complete, SPI transfer done).",
          "**(D) Software Interrupts:** Triggered explicitly by running program instructions (e.g., system calls, exceptions)."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "7. Interrupt Vector Table"
      },
      {
        "type": "paragraph",
        "text": "The CPU locates handler functions using a vector table mapping hardware interrupt sources to memory addresses:"
      },
      {
        "type": "image",
        "url": "/blog/12-safty/isr3.jpeg",
        "caption": "Interrupt vector table"
      },
      {
        "type": "mermaid",
        "code": "graph LR\n    Source[Interrupt Source] --> Vector[Vector Table]\n    Vector --> Addr[ISR Address]\n    Addr --> ISR[Execute ISR]"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "8. Interrupt Latency"
      },
      {
        "type": "paragraph",
        "text": "Interrupt latency is the duration between the hardware event and the execution of the first instruction in the ISR. It is influenced by CPU clock speed, context saving overhead, interrupt priority levels, and whether interrupts are currently disabled."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "9. Nested Interrupts"
      },
      {
        "type": "paragraph",
        "text": "Nested interrupts occur when a higher-priority interrupt preempts an active, lower-priority ISR:"
      },
      {
        "type": "code",
        "language": "text",
        "code": "Interrupt A (Low Priority ISR) ➔ Interrupted by ➔ Interrupt B (High Priority ISR)"
      },
      {
        "type": "paragraph",
        "text": "Improperly configured nested interrupts can cause CPU stack overflows and timing instability."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "10. Context Switching (Critical Concept)"
      },
      {
        "type": "paragraph",
        "text": "When an interrupt occurs, the hardware automatically performs a Context Save, storing registers and the Program Counter (PC). Upon ISR exit, a Context Restore retrieves the saved state so the normal execution thread resumes seamlessly."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "11. ISR Best Practices (Embedded Engineering)"
      },
      {
        "type": "list",
        "items": [
          "**Use flags:** Declare a volatile boolean flag to capture the event inside the ISR.",
          "**Keep ISR short:** Limit the ISR to flag setting; main loop processes the long logic.",
          "**Use volatile keyword:** Mark shared global variables as volatile to prevent compiler optimizations from caching the value.",
          "**Debouncing (buttons):** Mechanical buttons bounce, causing multiple false triggers. Filter bounces using software timestamps or hardware RC filters.",
          "**Avoid shared memory corruption:** Protect shared resources using atomic operations or critical sections."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "12. Interrupts in ESP32 Context"
      },
      {
        "type": "paragraph",
        "text": "On the ESP32 platform, interrupts have specific features due to its dual-core CPU, FreeRTOS scheduler, and cache architectures:"
      },
      {
        "type": "image",
        "url": "/blog/12-safty/isr4.jpeg",
        "caption": "Interrupts in ESP32 Context"
      },
      {
        "type": "list",
        "items": [
          "Supports hardware interrupts on any GPIO pin.",
          "Requires the `IRAM_ATTR` attribute to locate the ISR function in fast internal Instruction RAM, avoiding flash cache access delays."
        ]
      },
      {
        "type": "code",
        "language": "cpp",
        "code": "void IRAM_ATTR gpioISR() {\n    buttonPressed = true;\n}"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "13. Interrupt Priority Concept"
      },
      {
        "type": "paragraph",
        "text": "Interrupt priorities determine preemption rights. For example, a low-priority sensor update interrupt will be pre-empted if a high-priority emergency stop button interrupt is raised, guaranteeing immediate response to safety-critical signals."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "14. Common Mistakes"
      },
      {
        "type": "list",
        "items": [
          "**1. Long ISR execution:** Leads to watchdog resets and system lag.",
          "**2. Using Serial.print inside ISR:** Blocks and crashes the MCU.",
          "**3. Race conditions:** Unsafe reads/writes on shared variables.",
          "**4. Missing volatile keyword:** Causes the main loop to miss variable state changes.",
          "**5. Ignoring debounce:** Causes multiple false edge detections."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "15. Embedded Systems Design Pattern"
      },
      {
        "type": "table",
        "headers": [
          "Architecture",
          "Workflow Pattern"
        ],
        "rows": [
          [
            "✅ Correct Architecture",
            "ISR ➔ Set Flag ➔ Main Loop ➔ Process Event"
          ],
          [
            "❌ Wrong Architecture",
            "ISR ➔ Full Processing ➔ Blocking System"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "16. Interrupts in Robotics Systems"
      },
      {
        "type": "paragraph",
        "text": "In a robotics platform, interrupts enable fast responses to sensor triggers without latency:"
      },
      {
        "type": "mermaid",
        "code": "graph TD\n    Sensor[Sensor Trigger] --> ISR[ISR Handler]\n    ISR --> Flag[Set Flag / Buffer]\n    Flag --> Loop[Control Loop Processes]\n    Loop --> Move[Robot Movement / Stop]"
      },
      {
        "type": "list",
        "items": [
          "**Limit switch hit:** The ISR immediately cuts motor power.",
          "**Encoder pulses:** The ISR updates wheel/joint position counters in microsecond speeds.",
          "**Emergency button:** The ISR executes safety shutdown sequences."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "17. ISR vs RTOS Tasks"
      },
      {
        "type": "table",
        "headers": [
          "Feature",
          "ISR",
          "RTOS Task"
        ],
        "rows": [
          [
            "Execution time",
            "Microseconds",
            "Milliseconds"
          ],
          [
            "Complexity",
            "Very low",
            "High"
          ],
          [
            "Blocking allowed",
            "No",
            "Yes"
          ],
          [
            "Scheduling",
            "Hardware vector",
            "OS Scheduler"
          ],
          [
            "Purpose",
            "Immediate response",
            "Heavy processing logic"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Engineering Summary"
      },
      {
        "type": "blockquote",
        "text": "[!IMPORTANT] **Summary:** Interrupts are hardware-triggered events that immediately pause normal program execution, execute a special function (ISR), then resume the previous state."
      }
    ]
  },
  {
    "id": 14,
    "slug": "power_management",
    "title": "Power Management & Electronics for Robotics Systems",
    "date": "2026-06-23",
    "author": "Grabber Team",
    "category": "Engineering",
    "readTime": "7 min",
    "featured": true,
    "excerpt": "The design and control of energy flow in a robotic system to ensure stable voltage rails, safe current delivery, efficient conversion, and reliable operation.",
    "coverImage": "/blog/28-power/28-power.jpeg",
    "content": [
      {
        "type": "heading",
        "level": 1,
        "text": "Power Management & Electronics for Robotics Systems"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Core Idea"
      },
      {
        "type": "list",
        "items": [
          "Power management in robotics is NOT just \"supplying voltage\".",
          "It is NOT just using a battery.",
          "It is NOT just connecting a regulator."
        ]
      },
      {
        "type": "blockquote",
        "text": "[!IMPORTANT] **Power management is:** The design and control of energy flow in a robotic system to ensure stable voltage rails, safe current delivery, efficient conversion, and reliable operation of sensors, controllers, and actuators under dynamic load conditions."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "1. What Problem Power Management Solves"
      },
      {
        "type": "paragraph",
        "text": "Robots are electrically noisy systems with varying power demands across components:"
      },
      {
        "type": "list",
        "items": [
          "**Microcontrollers:** Need stable, noise-free 3.3V power.",
          "**Sensors:** Demand low-noise, highly filtered voltage rails.",
          "**Servos:** Draw heavy current bursts when starting or stalling.",
          "**Motors:** Create severe high-voltage inductive spikes during state transitions."
        ]
      },
      {
        "type": "paragraph",
        "text": "Without robust power management, common symptoms include voltage drops causing CPU resets (brownouts), motor noise leading to sensor failures, and overcurrent overheating or burning electrical components."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "2. Power Architecture in Robotics"
      },
      {
        "type": "image",
        "url": "/blog/28-power/28-power1.jpeg",
        "caption": "Power Architecture in Robotics"
      },
      {
        "type": "paragraph",
        "text": "A typical robotic power distribution topology runs from the source battery down to individual voltage rails:"
      },
      {
        "type": "mermaid",
        "code": "graph TD\n    Battery[Battery: 7.4V / 12V] --> BMS[Protection: BMS / Fuse]\n    BMS --> Buck1[DC-DC Buck: 5V Rail]\n    BMS --> Buck2[DC-DC Buck: 3.3V Rail]\n    Buck1 --> Servos[Servos / Sensors]\n    Buck2 --> MCU[ESP32 / MCU]\n    Servos & MCU --> GND[Common GND Reference]"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "3. Battery Systems"
      },
      {
        "type": "paragraph",
        "text": "Choosing the correct battery chemistry depends on weight, discharge rates, and runtime requirements:"
      },
      {
        "type": "list",
        "items": [
          "**Li-ion / LiPo:** Features high energy density, lightweight profiles, and high discharge currents (excellent for drone/robot arm power).",
          "**Lead Acid:** Heavy and cheap, providing stable power for large-scale, heavy ground robots.",
          "**LiFePO4:** Offers a safer chemistry with a significantly longer lifecycle than LiPo cells."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "4. Battery Management System (BMS)"
      },
      {
        "type": "paragraph",
        "text": "A Battery Management System (BMS) is essential to monitor and protect lithium-based battery packs against critical failure conditions:"
      },
      {
        "type": "image",
        "url": "/blog/28-power/28-power2.jpeg",
        "caption": "Battery Management"
      },
      {
        "type": "list",
        "items": [
          "**Overcharge & Over-discharge:** Keeps cell voltages within safe operating limits.",
          "**Overcurrent & Overheating:** Restricts output when load currents or temperatures spike.",
          "**Cell Imbalance:** Balances voltage levels across series-connected cells."
        ]
      },
      {
        "type": "blockquote",
        "text": "[!WARNING] **Why it matters:** Bypassing a BMS exposes the battery to instability, thermal runaway, fire risks, and permanent cell damage."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "5. Voltage Regulation (DC-DC Converters)"
      },
      {
        "type": "paragraph",
        "text": "Batteries are not stable voltage sources; their output drops as they discharge. Voltage regulators maintain stable operating rails:"
      },
      {
        "type": "list",
        "items": [
          "**(A) Buck Converter (Step Down):** Highly efficient (~80-90%) switching regulators that step down voltage (e.g. 12V to 5V via LM2596) with minimal thermal waste.",
          "**(B) LDO Regulator (Low Dropout):** Low noise but low efficiency, ideal for powering analog sensors and MCUs requiring clean, ripple-free power.",
          "**(C) Boost Converter (Step Up):** Steps up lower battery voltages to higher operating rails (e.g., 3.7V single-cell LiPo to 5V/12V)."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "6. Power Distribution Strategy"
      },
      {
        "type": "paragraph",
        "text": "Use a Star Power ground distribution topology where all ground return paths meet at a single central point. This prevents ground loops, reduces common-impedance noise coupling, and stabilizes sensor readings."
      },
      {
        "type": "image",
        "url": "/blog/28-power/28-power3.jpeg",
        "caption": "Power Distribution"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "7. Noise in Robotics Systems"
      },
      {
        "type": "paragraph",
        "text": "Robots generate significant electrical noise from DC motors, servo movements, and high-frequency switching regulators. This noise can cause ESP32 resets, fluctuating sensor readings, and communication errors. Mitigate noise using decoupling capacitors, ferrite beads, separate power rails, and single-point grounding."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "8. Motor Power vs Logic Power Separation"
      },
      {
        "type": "paragraph",
        "text": "Keep motor power lines electrically isolated from logic circuitry. Connect high-current, noisy motor drivers directly to the battery, while logic circuits are powered through a dedicated regulator."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "9. Decoupling Capacitors"
      },
      {
        "type": "paragraph",
        "text": "Place decoupling capacitors close to IC power pins. Use 100nF ceramic capacitors to suppress high-frequency noise spikes and 100µF electrolytic capacitors for bulk energy storage and voltage ripple stabilization."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "10. Servo Power Challenges"
      },
      {
        "type": "paragraph",
        "text": "Servos draw high transient currents during start-up or when stalled (e.g., SG90 draws 500mA peaks, MG996R draws over 2A peaks). These spikes can drop the voltage rail, causing microcontroller brownout resets. Solve this by separating the servo power rail, using high-current buck converters, and placing large capacitor banks near the servo distribution board."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "11. Robotics Power System Example"
      },
      {
        "type": "paragraph",
        "text": "An example of a balanced power system configuration powered from a 12V battery source:"
      },
      {
        "type": "table",
        "headers": [
          "Load Category",
          "Regulator Type",
          "Voltage Rail",
          "Target Components"
        ],
        "rows": [
          [
            "Logic & Sensors",
            "LDO / Low-Noise Buck",
            "3.3V / 5.0V",
            "ESP32, IMU, INA226"
          ],
          [
            "Actuators (Servos)",
            "High-Current Buck",
            "5.0V - 6.0V",
            "MG996R, SG90 Servos"
          ],
          [
            "High Power Motors",
            "Direct Battery",
            "12V Raw",
            "DC Motor Driver, H-Bridge"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "12. Common Failure Modes"
      },
      {
        "type": "list",
        "items": [
          "**1. Brownout Reset:** Voltage drops below the MCU minimum operating threshold.",
          "**2. Motor Noise Reset:** Inductive kickback spikes corrupt digital logic.",
          "**3. Overheating Regulator:** Running high current through inefficient linear/LDO regulators.",
          "**4. Ground Loop Noise:** Circular ground wiring injecting noise into analog readings.",
          "**5. Battery Undervoltage Damage:** Over-discharging Li-ion cells below critical thresholds."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "13. Design Rules (Engineering Best Practices)"
      },
      {
        "type": "list",
        "items": [
          "**Rule 1: Separate Power Domains:** Keep logic, motors, and sensors isolated.",
          "**Rule 2: Always use a BMS:** Never bypass safety-critical battery protection circuits.",
          "**Rule 3: Oversize current capacity:** Size power supply components with 30-50% safety margins.",
          "**Rule 4: Add capacitors everywhere:** Place decoupling capacitors near motor connections and ICs.",
          "**Rule 5: Measure real current draw:** Don't rely solely on theoretical data sheet current metrics."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "14. Power Budgeting"
      },
      {
        "type": "paragraph",
        "text": "Calculate your total system power budget under worst-case peak loads to size the battery and regulators correctly:"
      },
      {
        "type": "table",
        "headers": [
          "Component",
          "Typical Current",
          "Peak Current",
          "Voltage Rail"
        ],
        "rows": [
          [
            "ESP32 MCU",
            "120 mA",
            "300 mA",
            "3.3V"
          ],
          [
            "YOLO Camera Node",
            "500 mA",
            "1.2 A",
            "5V"
          ],
          [
            "Servos (MG996R x4)",
            "800 mA",
            "4.0 A",
            "6V"
          ],
          [
            "DC Drive Motors",
            "1.5 A",
            "5.0 A",
            "12V"
          ],
          [
            "Sensors (IMU, INA226)",
            "50 mA",
            "100 mA",
            "3.3V"
          ]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "15. Safety Considerations"
      },
      {
        "type": "list",
        "items": [
          "Integrate inline fuses to protect against short circuits.",
          "Select appropriate wire gauge thickness to handle peak current without heating up.",
          "Verify thermal shutdown features are active on voltage regulators.",
          "Ensure proper wire insulation and isolation."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "16. Power System in Your Robotics Stack"
      },
      {
        "type": "paragraph",
        "text": "In the Grabber robotics stack, power distribution coordinates across multiple subsystems:"
      },
      {
        "type": "mermaid",
        "code": "graph TD\n    Battery[12V Battery] --> PowerBoard[Power Board]\n    PowerBoard --> ESP32[ESP32 Control Logic]\n    PowerBoard --> Camera[YOLO Camera System]\n    PowerBoard --> Servos[Servo Motors - Arm]\n    PowerBoard --> DC[DC Motors - Movement]\n    PowerBoard --> Sensors[Sensors: INA226, IMU]"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Engineering Summary"
      },
      {
        "type": "blockquote",
        "text": "[!IMPORTANT] **Summary:** Power management is the design and control of energy flow in a robotic system to ensure stable voltage rails, safe current delivery, efficient conversion, and reliable operation of sensors, controllers, and actuators under dynamic load conditions."
      }
    ]
  }
];

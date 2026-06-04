import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Star, 
  GitFork, 
  ExternalLink,
  Terminal,
  Code2,
  Cpu,
  Smartphone,
  Layout,
  Network,
  ShieldCheck,
  Bot,
  Activity,
  Brain,
  Cloud
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

gsap.registerPlugin(ScrollTrigger);

export function RepositoriesPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.timeline-item');
    
    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        { 
          opacity: 0, 
          x: index % 2 === 0 ? -30 : 30,
          y: 20 
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );

      // Animate the vertical line
      if (index === 0) {
        gsap.fromTo(
          '.timeline-line',
          { scaleY: 0 },
          { 
            scaleY: 1, 
            duration: 2, 
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 1,
            }
          }
        );
      }
    });
  }, []);

  const repos = [
    {
      id: '01',
      name: '01-grabber-architecture',
      description: 'The master blueprint of the entire ecosystem. Defines data contracts, microservice boundaries, and system-wide security protocols.',
      language: 'SPEC',
      icon: Cpu,
      tech: ['Architecture', 'Mermaid', 'Markdown'],
      stars: 42
    },
    {
      id: '02',
      name: '02-grabber-firmware',
      description: 'Hard real-time motor control loops for the 4-axis robotic arm. Implements PID controllers and hardware abstraction layers.',
      language: 'C++',
      icon: Terminal,
      tech: ['STM32', 'FreeRTOS', 'CAN Bus'],
      stars: 38
    },
    {
      id: '03',
      name: '03-grabber-mobile-app',
      description: 'Remote diagnostic and control application for field operations. Features real-time telemetry visualization and remote overrides.',
      language: 'DART',
      icon: Smartphone,
      tech: ['Flutter', 'Riverpod', 'WebSockets'],
      stars: 65
    },
    {
      id: '04',
      name: '04-grabber-web-dashboard',
      description: 'The primary command and control terminal. Features a 3D digital twin, canvas path drawing, and comprehensive system telemetry.',
      language: 'REACT',
      icon: Layout,
      tech: ['Vite', 'GSAP', 'Three.js'],
      stars: 89
    },
    {
      id: '05',
      name: '05-grabber-api-gateway',
      description: 'Central orchestrator for all internal communications. Manages signal routing, rate limiting, and unified API documentation.',
      language: 'GO',
      icon: Network,
      tech: ['Gin', 'gRPC', 'Redis'],
      stars: 52
    },
    {
      id: '06',
      name: '06-grabber-auth-service',
      description: 'Identity management system implementing hardware-level security. Handles RBAC, OAuth2, and secure device pairing.',
      language: 'NODE',
      icon: ShieldCheck,
      tech: ['Express', 'JWT', 'PostgreSQL'],
      stars: 47
    },
    {
      id: '07',
      name: '07-grabber-robot-service',
      description: 'High-level logic and kinematic engine. Calculates inverse kinematics, path planning, and autonomous task execution.',
      language: 'PYTHON',
      icon: Bot,
      tech: ['ROS2', 'MoveIt', 'NumPy'],
      stars: 55
    },
    {
      id: '08',
      name: '08-grabber-telemetry-service',
      description: 'Real-time data ingestion and time-series analysis. Monitors system health and stores operational history for forensics.',
      language: 'NODE',
      icon: Activity,
      tech: ['InfluxDB', 'MQTT', 'Grafana'],
      stars: 34
    },
    {
      id: '09',
      name: '09-grabber-ai-service',
      description: 'Neural vision core for autonomous operations. Provides object detection, spatial awareness, and pick-and-place logic.',
      language: 'PYTORCH',
      icon: Brain,
      tech: ['Python', 'OpenCV', 'CUDA'],
      stars: 78
    },
    {
      id: '10',
      name: '10-grabber-devops-infras',
      description: 'Automated infrastructure and delivery pipelines. Ensures sub-second deployment latency and system-wide high availability.',
      language: 'K8S',
      icon: Cloud,
      tech: ['Terraform', 'Helm', 'ArgoCD'],
      stars: 41
    }
  ];

  return (
    <div ref={containerRef} className="pb-32 relative pattern-dots">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center space-y-8 mb-24 pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 mb-4 animate-pulse-slow">
          <Code2 size={14} className="text-brand-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Infrastructure Blueprint</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter leading-tight">
          System <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary">Microservices</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          The Grabber platform is composed of 10 specialized repositories, each engineered for maximum efficiency and reliability.
        </p>
        
        <div className="flex items-center justify-center gap-6 pt-4">
          <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-slate-900/20">
            <FaGithub size={18} /> View Organization
          </button>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative max-w-6xl mx-auto px-6">
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-100 -translate-x-1/2 hidden lg:block">
          <div className="timeline-line absolute top-0 left-0 w-full bg-gradient-to-b from-brand-accent via-brand-secondary to-brand-accent origin-top scale-y-0" />
        </div>

        <div className="space-y-12 lg:space-y-0">
          {repos.map((repo, idx) => (
            <div 
              key={repo.id}
              className={`timeline-item flex flex-col lg:flex-row items-center gap-8 lg:gap-0 lg:mb-24 relative ${
                idx % 2 === 0 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content Card */}
              <div className="w-full lg:w-[45%]">
                <div className="glass-card-vibrant group p-8 lg:p-10 hover:border-brand-accent/40 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-accent/10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-slate-50 text-slate-400 group-hover:bg-brand-accent group-hover:text-white rounded-2xl transition-all duration-500 rotate-0 group-hover:-rotate-6">
                      <repo.icon size={28} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-4xl font-black text-slate-100 group-hover:text-brand-accent/20 transition-colors duration-500 leading-none">
                        {repo.id}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2 px-2 py-1 bg-slate-50 rounded-lg">
                        {repo.language}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-brand-accent transition-colors">
                    {repo.name}
                  </h3>
                  
                  <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm lg:text-base">
                    {repo.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {repo.tech.map(t => (
                      <span key={t} className="text-[9px] font-black uppercase tracking-tighter px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-slate-400 group-hover:border-brand-accent/20 group-hover:text-brand-accent transition-all">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 group/stat">
                        <Star size={16} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black text-slate-500">{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-2 group/stat">
                        <GitFork size={16} className="text-slate-400" />
                        <span className="text-xs font-black text-slate-500">Fork</span>
                      </div>
                    </div>
                    <button className="p-3 bg-slate-900 text-white hover:bg-brand-accent rounded-xl transition-all shadow-lg shadow-slate-900/10">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline Node (Middle) */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-12 h-12 rounded-2xl bg-white border-4 border-slate-100 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="w-3 h-3 rounded-full bg-brand-accent group-hover:bg-brand-secondary transition-colors" />
                </div>
              </div>

              {/* Empty Space for the other side */}
              <div className="hidden lg:block lg:w-[45%]" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto mt-32 px-6">
        <div className="glass-card p-12 bg-slate-900 border-none text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 to-brand-secondary/20 opacity-50" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-black text-white tracking-tight">Ready to Contribute?</h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto">
              We maintain a high engineering standard across all repositories. Review our protocol before opening a Pull Request.
            </p>
            <button className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              Developer Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


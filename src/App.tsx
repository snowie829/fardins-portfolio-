/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'motion/react';
import { 
  Shield, 
  Code, 
  Database, 
  Layout, 
  Mail, 
  Phone, 
  MapPin, 
  Download, 
  ExternalLink, 
  Menu, 
  X, 
  CheckCircle2,
  Github,
  Linkedin,
  MessageSquare,
  Award,
  Briefcase,
  GraduationCap,
  User,
  Cpu,
  PenTool,
  BarChart3
} from 'lucide-react';

// --- Components ---

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00f5ff';
      
      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

const TypingEffect = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="text-cyber-cyan neon-text-cyan border-r-2 border-cyber-cyan pr-1">
      {words[index].substring(0, subIndex)}
    </span>
  );
};

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-wider">
          {children}
          <div className="h-1 w-24 bg-cyber-cyan mx-auto mt-4 rounded-full neon-glow-cyan" />
        </h2>
        {subtitle && <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
      </motion.div>
    </div>
  );
};

const SkillBar = ({ name, percentage }: { name: string; percentage: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{name}</span>
        <span className="text-cyber-cyan">{percentage}%</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-cyber-blue to-cyber-cyan neon-glow-cyan"
        />
      </div>
    </div>
  );
};

const TimelineItem = ({ title, company, duration, description, type }: { title: string; company: string; duration: string; description: string[]; type: 'work' | 'edu' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative pl-8 pb-12 border-l-2 border-cyber-blue/30 last:pb-0"
    >
      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-cyber-bg border-2 border-cyber-cyan neon-glow-cyan" />
      <div className="glass-card p-6 hover:border-cyber-cyan/50 transition-all duration-300">
        <span className="text-cyber-cyan text-sm font-mono mb-2 block">{duration}</span>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-cyber-blue font-medium mb-4">{company}</p>
        <ul className="space-y-2">
          {description.map((item, i) => (
            <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const ServiceCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="glass-card p-8 group hover:border-cyber-cyan transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>
      <div className="w-14 h-14 bg-cyber-blue/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyber-cyan/20 transition-colors">
        <Icon className="text-cyber-cyan" size={28} />
      </div>
      <h3 className="text-xl font-bold mb-4 group-hover:text-cyber-cyan transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  const roles = [
    "Cybersecurity Specialist",
    "Ethical Hacker",
    "Canva Template Expert",
    "Data Entry Professional"
  ];

  const personalInfo = [
    { label: "Date of Birth", value: "10 August 2003" },
    { label: "Age", value: "22" },
    { label: "Nationality", value: "Bangladeshi" },
    { label: "Religion", value: "Islam" },
    { label: "Blood Group", value: "B+" },
    { label: "Height", value: "5'11\"" },
    { label: "Weight", value: "70 KG" },
    { label: "Marital Status", value: "Single" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-cyber-cyan z-50 origin-left neon-glow-cyan"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-cyber-bg/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-cyan rounded-lg flex items-center justify-center neon-glow-cyan">
                <Shield className="text-cyber-bg" size={24} />
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase">
                Fardin<span className="text-cyber-cyan">.</span>
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-cyber-cyan transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="mailto:islamfardin717@gmail.com"
                className="px-6 py-2 bg-cyber-cyan text-cyber-bg font-bold rounded-full hover:bg-white transition-all neon-glow-cyan"
              >
                HIRE ME
              </a>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-cyber-bg border-b border-white/10 overflow-hidden"
            >
              <div className="px-4 py-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-gray-300 hover:text-cyber-cyan transition-colors uppercase tracking-widest"
                  >
                    {link.name}
                  </a>
                ))}
                <a 
                  href="mailto:islamfardin717@gmail.com"
                  className="w-full py-3 bg-cyber-cyan text-cyber-bg font-bold rounded-lg text-center neon-glow-cyan"
                >
                  HIRE ME
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center pt-20 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-cyber-cyan font-mono tracking-[0.3em] uppercase mb-4 block">
                Welcome to my digital fortress
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-cyan">MD. Shajahan Mia Fardin</span>
              </h1>
              <div className="text-2xl md:text-3xl font-medium mb-8 h-12">
                I am a <TypingEffect words={roles} />
              </div>
              <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
                Cybersecurity Specialist and Creative Designer dedicated to securing digital assets and crafting high-converting visual identities.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="mailto:islamfardin717@gmail.com"
                  className="px-8 py-4 bg-cyber-cyan text-cyber-bg font-bold rounded-lg flex items-center gap-2 hover:bg-white transition-all neon-glow-cyan group"
                >
                  HIRE ME <Mail size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="#"
                  className="px-8 py-4 border border-cyber-cyan text-cyber-cyan font-bold rounded-lg flex items-center gap-2 hover:bg-cyber-cyan/10 transition-all"
                >
                  DOWNLOAD CV <Download size={20} />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative w-64 h-64 md:w-96 md:h-96">
                {/* Animated Rings */}
                <div className="absolute inset-0 border-2 border-cyber-cyan/30 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-[-10px] border border-cyber-blue/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                
                {/* Profile Image Container */}
                <div className="absolute inset-0 rounded-full p-2 bg-gradient-to-br from-cyber-blue to-cyber-cyan neon-glow-cyan overflow-hidden">
                  <div className="w-full h-full rounded-full bg-cyber-bg overflow-hidden border-4 border-cyber-bg">
                    <img 
                      src="/profile.jpg" 
                      alt="MD. Shajahan Mia Fardin"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                      style={{ borderRadius: '50%', boxShadow: '0 0 15px rgba(0, 245, 255, 0.6)' }}
                    />
                  </div>
                </div>
                
                {/* Floating Badges */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-cyber-bg border border-cyber-cyan p-3 rounded-xl glass-card"
                >
                  <Shield className="text-cyber-cyan" size={24} />
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-cyber-bg border border-cyber-blue p-3 rounded-xl glass-card"
                >
                  <Code className="text-cyber-blue" size={24} />
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-cyber-cyan rounded-full" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-4 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <SectionHeading subtitle="Get to know the person behind the screen">ABOUT ME</SectionHeading>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card p-8 relative z-10">
                  <h3 className="text-2xl font-bold mb-6 text-cyber-cyan">Professional Summary</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    I am a highly motivated Cybersecurity Specialist and Creative Designer with a strong foundation in business studies. My journey spans from IT operations and retail management to becoming a specialist in vulnerability assessments and professional Canva design.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Based in Narayanganj, Bangladesh, I combine technical expertise with creative flair to deliver high-quality solutions for international clients on platforms like Fiverr and Upwork.
                  </p>
                </div>
                {/* Decorative element */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-cyber-cyan opacity-50" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-cyber-blue opacity-50" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  <User className="text-cyber-cyan" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {personalInfo.map((info, i) => (
                    <div key={i} className="border-b border-white/5 pb-2">
                      <span className="text-gray-500 text-sm block uppercase tracking-tighter">{info.label}</span>
                      <span className="text-white font-medium">{info.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 p-6 bg-cyber-blue/10 rounded-xl border border-cyber-blue/20">
                  <p className="text-sm text-cyber-blue font-mono flex items-center gap-2">
                    <MapPin size={16} /> Location: Hajiganj, Narayanganj, Bangladesh
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeading subtitle="My technical arsenal and creative capabilities">MY SKILLS</SectionHeading>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <Cpu className="text-cyber-cyan" /> Technical Skills
                </h3>
                <SkillBar name="Data Entry & Management" percentage={95} />
                <SkillBar name="Cybersecurity & Ethical Hacking" percentage={90} />
                <SkillBar name="MS Office & Google Workspace" percentage={88} />
              </div>
              
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <PenTool className="text-cyber-cyan" /> Creative & Professional
                </h3>
                <SkillBar name="Canva Template Design" percentage={92} />
                <SkillBar name="Sales & Client Relations" percentage={85} />
                <SkillBar name="Creative Design & Editing" percentage={80} />
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, label: "Security Audits" },
                { icon: Layout, label: "UI/UX Design" },
                { icon: Database, label: "Data Records" },
                { icon: BarChart3, label: "Sales Strategy" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-6 text-center flex flex-col items-center gap-4 group"
                >
                  <item.icon className="text-cyber-cyan group-hover:scale-110 transition-transform" size={32} />
                  <span className="font-bold text-sm uppercase tracking-widest">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24 px-4 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Work Experience */}
              <div>
                <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                  <Briefcase className="text-cyber-cyan" /> WORK EXPERIENCE
                </h2>
                <div className="space-y-2">
                  <TimelineItem 
                    title="Freelancer (Cybersecurity & Canva Design)"
                    company="Fiverr & Upwork"
                    duration="2026 – Ongoing"
                    description={[
                      "Vulnerability assessments and penetration testing",
                      "Professional Canva template design for international clients",
                      "100% client satisfaction and on-time delivery"
                    ]}
                    type="work"
                  />
                  <TimelineItem 
                    title="IT Sector Specialist"
                    company="Sk Online Shop, Bandar"
                    duration="2025 – 2026 (8 Months)"
                    description={[
                      "Data entry and digital record management",
                      "IT system operations and maintenance",
                      "Optimized digital workflow for better efficiency"
                    ]}
                    type="work"
                  />
                  <TimelineItem 
                    title="Store Manager"
                    company="Bakers Club, Shibu Market"
                    duration="2024 – 2025 (8 Months)"
                    description={[
                      "Managed store operations and staff supervision",
                      "Inventory management and sales strategy execution",
                      "Enhanced customer satisfaction ratings"
                    ]}
                    type="work"
                  />
                  <TimelineItem 
                    title="Outdoor Sales Representative"
                    company="OPPO, Chashara"
                    duration="2023 – 2024 (1 Year)"
                    description={[
                      "Mobile device sales and product demonstrations",
                      "Established and maintained retail partnerships",
                      "Consistently met and exceeded sales targets"
                    ]}
                    type="work"
                  />
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                  <GraduationCap className="text-cyber-cyan" /> EDUCATION
                </h2>
                <div className="space-y-2">
                  <TimelineItem 
                    title="B.B.S (Bachelor of Business Studies)"
                    company="Sonargaon Government College, Narayanganj"
                    duration="2023 – 2026 (Ongoing)"
                    description={[
                      "Major in Business Studies",
                      "Developing strong analytical and management skills",
                      "Active participation in college IT initiatives"
                    ]}
                    type="edu"
                  />
                  <TimelineItem 
                    title="H.S.C (Higher Secondary Certificate)"
                    company="Government Kadam Rasul College, Bandar"
                    duration="2020 – 2022"
                    description={[
                      "Business Studies Group",
                      "Dhaka Board",
                      "Excelled in accounting and business organization"
                    ]}
                    type="edu"
                  />
                  <TimelineItem 
                    title="S.S.C (Secondary School Certificate)"
                    company="Muktijoddha Smrity Biddyaniketon, Pathantuli"
                    duration="2014 – 2019"
                    description={[
                      "Business Studies Group",
                      "Dhaka Board",
                      "Foundation of professional and academic excellence"
                    ]}
                    type="edu"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeading subtitle="Specialized solutions for your business needs">MY SERVICES</SectionHeading>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ServiceCard 
                icon={Shield}
                title="Cybersecurity"
                description="Comprehensive vulnerability assessments, penetration testing, and security audits to protect your business assets."
              />
              <ServiceCard 
                icon={Layout}
                title="Canva Design"
                description="High-converting, professional Canva templates tailored for Upwork and Fiverr clients to boost brand identity."
              />
              <ServiceCard 
                icon={Database}
                title="Data Management"
                description="Accurate, fast, and professional data entry and management services to keep your digital records organized."
              />
              <ServiceCard 
                icon={Cpu}
                title="IT Support"
                description="Reliable system management, digital record keeping, and IT operations support for small to medium businesses."
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-4 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <SectionHeading subtitle="Let's discuss your next project">GET IN TOUCH</SectionHeading>
            
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-8">
                <div className="glass-card p-8 flex items-start gap-6">
                  <div className="w-12 h-12 bg-cyber-cyan/10 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="text-cyber-cyan" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Email Me</h4>
                    <p className="text-gray-400 text-sm">islamfardin717@gmail.com</p>
                  </div>
                </div>
                
                <div className="glass-card p-8 flex items-start gap-6">
                  <div className="w-12 h-12 bg-cyber-blue/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="text-cyber-blue" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Call Me</h4>
                    <p className="text-gray-400 text-sm">01872565921</p>
                  </div>
                </div>
                
                <div className="glass-card p-8 flex items-start gap-6">
                  <div className="w-12 h-12 bg-cyber-cyan/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="text-cyber-cyan" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Location</h4>
                    <p className="text-gray-400 text-sm">Hajiganj, Narayanganj, Bangladesh</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <form className="glass-card p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 uppercase tracking-widest">Your Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyber-cyan transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 uppercase tracking-widest">Your Email</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyber-cyan transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 uppercase tracking-widest">Message</label>
                    <textarea 
                      rows={5}
                      placeholder="How can I help you?"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyber-cyan transition-colors resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-cyber-cyan text-cyber-bg font-bold rounded-lg hover:bg-white transition-all neon-glow-cyan uppercase tracking-widest"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyber-cyan rounded flex items-center justify-center">
              <Shield className="text-cyber-bg" size={18} />
            </div>
            <span className="font-bold uppercase tracking-tighter">Fardin.</span>
          </div>
          
          <p className="text-gray-500 text-sm">
            © 2026 MD. Shajahan Mia Fardin. All Rights Reserved.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors"><MessageSquare size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors"><Github size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/8801872565921"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 group"
      >
        <MessageSquare className="text-white fill-white" size={32} />
        <span className="absolute right-20 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}

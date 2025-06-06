"use client";
import React from "react";
import {
  Github,
  Linkedin,
  Mail,
  Heart,
  ArrowUp,
  MapPin,
  Clock,
} from "lucide-react";
import { BackgroundGradient } from "./ui/BackgroundGradient";

interface FooterProps {
  profile?: {
    name?: string;
    email?: string;
    github?: string;
    linkedin?: string;
    location?: string;
  };
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
  ];

  const services = [
    "Web Development",
    "UI/UX Design",
    "Full-Stack Solutions",
    "API Development",
    "Database Design",
    "Code Review",
  ];

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-900/50 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {profile?.name || "Developer"}
                </h3>
                <p className="text-neutral-400 leading-relaxed max-w-md">
                  Passionate full-stack developer crafting digital experiences
                  that combine beautiful design with powerful functionality.
                  Let&apos;s build something amazing together.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {profile?.email && (
                  <div className="flex items-center gap-3 text-neutral-400 hover:text-emerald-400 transition-colors group">
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <a href={`mailto:${profile.email}`} className="text-sm">
                      {profile.email}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3 text-neutral-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {profile?.location || "Available Worldwide"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-neutral-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">GMT+10 (Available 24/7)</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {profile?.github && (
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:scale-110"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                  </a>
                )}

                {profile?.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-110"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5 text-neutral-400 group-hover:text-blue-400 transition-colors" />
                  </a>
                )}

                <a
                  href="#contact"
                  className="group p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-110"
                  aria-label="Contact Me"
                >
                  <Mail className="w-5 h-5 text-neutral-400 group-hover:text-purple-400 transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-neutral-400 hover:text-emerald-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-neutral-600 group-hover:bg-emerald-400 rounded-full transition-colors" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="lg:col-span-3">
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                Services
              </h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service}>
                    <span className="text-neutral-400 text-sm flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div className="lg:col-span-2">
              <BackgroundGradient className="rounded-2xl p-1">
                <div className="bg-neutral-900 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">
                    Love My Work?
                  </h4>
                  <p className="text-neutral-400 text-sm">
                    Let&apos;s collaborate on your next project
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Get In Touch
                  </a>
                </div>
              </BackgroundGradient>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="flex items-center gap-2 text-neutral-400 text-sm">
                <span>© {currentYear}</span>
                <span className="text-emerald-400 font-medium">
                  {profile?.name || "Developer"}
                </span>
                <span>• Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span>using Next.js & TypeScript</span>
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 text-neutral-400 hover:text-emerald-400 text-sm"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-20 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-20" />
        <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30" />
        <div className="absolute bottom-40 right-10 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-25" />
      </div>
    </footer>
  );
};

export default Footer;

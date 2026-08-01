"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, FileText, Server, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionContent {
  title: string;
  body: string;
}

export function TechnicalWhitepaper() {
  const [content, setContent] = useState<SectionContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We will fetch the content via an API route or simply mock it if the API is missing for the demo.
    // Wait, since we are a Client Component, we should fetch from an API route. 
    // Actually, passing it as a Server Component is better, but since it's just text, let's fetch it via a Server Action or API.
    // For now, let's fetch it directly from the Next.js API route we will create.
    fetch('/api/whitepaper')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || content.length === 0) return null;

  return (
    <section className="bg-[var(--color-surface)] py-24 md:py-32 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 h-[40rem] w-[40rem] rounded-full bg-gradient-to-bl from-[var(--color-accent-blue)]/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-[var(--color-accent-cyan)]/5 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--color-text)] mb-6">
            Enterprise Architecture & Security Deep Dive
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Explore the rigorous technical standards, compliance mandates (SOC2, GDPR), and architectural patterns that power Synova Infotech's most resilient solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {content.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 p-8 md:p-10 backdrop-blur-sm flex flex-col h-full"
            >
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-[var(--color-accent-blue)]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative flex-1">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center shrink-0 rounded-2xl bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]">
                    {i % 4 === 0 ? <Server className="h-6 w-6" /> : i % 4 === 1 ? <ShieldCheck className="h-6 w-6" /> : i % 4 === 2 ? <Lock className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <h3 className="text-xl font-bold font-heading text-[var(--color-text)] leading-tight">{section.title}</h3>
                </div>
                
                <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--color-text-secondary)]">
                  <p className="leading-relaxed">{section.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'motion/react';
import { BookOpen, Layers, Route, Zap } from 'lucide-react';
import Link from 'next/link';

const defaultDocs = [
  { name: 'Getting Started', icon: <BookOpen size={16} />, href: '#' },
  { name: 'Project Structure', icon: <Layers size={16} />, href: '#' },
  { name: 'Routing Patterns', icon: <Route size={16} />, href: '#' },
  { name: 'Best Practices', icon: <Zap size={16} />, href: '#' },
];

export default function LeftDefault() {
  return (
    <aside className="h-full flex flex-col gap-8">
      {/* Section Header */}
      <div className="px-1">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-4 px-2">
          Overview
        </h3>

        <nav className="space-y-1">
          {defaultDocs.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ x: 4 }}
            >
              <Link
                href={item.href}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground
                           hover:text-primary hover:bg-primary/8
                           transition-all duration-200"
              >
                <span
                  className="flex items-center justify-center size-7 rounded-lg bg-muted/60 text-muted-foreground
                                 group-hover:bg-primary/15 group-hover:text-primary transition-colors"
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Helpful tip card */}
      <div className="mt-auto mx-1">
        <div className="card-glass p-4 rounded-2xl">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Showing default navigation. Use the search or breadcrumbs to find
            specific sections.
          </p>
        </div>
      </div>
    </aside>
  );
}

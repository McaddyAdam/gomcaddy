import React from 'react';
import { Twitter, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-12 border-t border-border/50 bg-card p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-foreground">
          <div className="font-bold">GoMcaddy</div>
          <div className="text-muted-foreground">Chop Now, No Long Thing</div>
        </div>

        <div className="text-sm text-muted-foreground">Contact: <a href="mailto:mcaddytechsolutions@gmail.com" className="text-primary hover:underline">mcaddytechsolutions@gmail.com</a></div>

        <div className="flex items-center gap-3">
          <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="mailto:mcaddytechsolutions@gmail.com" aria-label="Email" className="text-muted-foreground hover:text-primary">
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

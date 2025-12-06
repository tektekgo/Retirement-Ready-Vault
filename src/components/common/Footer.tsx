import React from 'react';
import { getVersion } from '../../utils/version';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const version = getVersion();

  return (
    <footer className={`bg-background border-t border-muted-100 py-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-foreground-600">
                © 2025 AI-Focus.org | <a href="https://www.ai-focus.org" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-accent-600 transition-colors">www.ai-focus.org</a>
              </p>
              <p className="text-xs text-foreground-500 mt-2">
                Email: <a href="mailto:retirement-ready-vault@ai-focus.org" className="text-accent-500 hover:text-accent-600">retirement-ready-vault@ai-focus.org</a>
        </p>
        <p className="text-xs text-foreground-400 mt-2">
          Version: <span className="font-mono font-medium">{version}</span>
        </p>
      </div>
    </footer>
  );
};


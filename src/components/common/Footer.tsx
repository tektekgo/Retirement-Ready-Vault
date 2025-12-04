import React from 'react';
import { getVersion } from '../../utils/version';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const version = getVersion();

  return (
    <footer className={`bg-white border-t border-charcoal-200 py-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-charcoal-600">
          © 2025 AI-Focus.org | <a href="https://www.ai-focus.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 transition-colors">www.ai-focus.org</a>
        </p>
        <p className="text-xs text-charcoal-500 mt-2">
          Email: <a href="mailto:retirement-ready-vault@ai-focus.org" className="text-blue-600 hover:text-blue-500">retirement-ready-vault@ai-focus.org</a>
        </p>
        <p className="text-xs text-charcoal-400 mt-2">
          Version: <span className="font-mono font-medium">{version}</span>
        </p>
      </div>
    </footer>
  );
};


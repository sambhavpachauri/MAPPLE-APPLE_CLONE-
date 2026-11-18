import React, { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  {
    text: 'Complimentary standard delivery across India on all MAPPLE devices.',
    linkText: 'Learn more',
    linkUrl: '/shipping-returns',
  },
  {
    text: 'Introducing the M-Titan & M-Compute silicon generation. Mind-blowing performance.',
    linkText: 'Explore',
    linkUrl: '/store',
  },
  {
    text: 'Save 10% on flagship orders over ₹10,000 with promo code MAPPLE10.',
    linkText: 'Shop now',
    linkUrl: '/store',
  },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div className="bg-[#1d1d1f] text-neutral-300 text-xs py-2 px-4 transition-all relative z-40 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center font-normal flex items-center justify-center gap-1.5 transition-opacity duration-300">
          <span>{current.text}</span>
          <Link
            to={current.linkUrl}
            className="text-blue-400 hover:text-blue-300 inline-flex items-center font-medium underline underline-offset-2 ml-1"
          >
            {current.linkText}
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-neutral-500 hover:text-neutral-300 transition-colors p-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

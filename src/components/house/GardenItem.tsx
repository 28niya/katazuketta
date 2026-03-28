type GardenItemProps = {
  type: string;
};

export function GardenItem({ type }: GardenItemProps) {
  switch (type) {
    case 'flower':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <circle cx="12" cy="8" r="4" fill="#ed64a6" opacity="0.9" />
          <circle cx="12" cy="8" r="2" fill="#f6ad55" />
          <line x1="12" y1="12" x2="12" y2="22" stroke="#38b2ac" strokeWidth="2" />
        </svg>
      );
    case 'fence':
      return (
        <svg viewBox="0 0 32 20" className="w-8 h-5">
          <rect x="2" y="4" width="3" height="16" rx="1" fill="#d6c1ac" />
          <rect x="14" y="4" width="3" height="16" rx="1" fill="#d6c1ac" />
          <rect x="26" y="4" width="3" height="16" rx="1" fill="#d6c1ac" />
          <rect x="0" y="8" width="32" height="2" rx="1" fill="#e6d9ce" />
          <rect x="0" y="14" width="32" height="2" rx="1" fill="#e6d9ce" />
        </svg>
      );
    case 'mailbox':
      return (
        <svg viewBox="0 0 20 28" className="w-5 h-7">
          <rect x="8" y="12" width="4" height="16" fill="#d6c1ac" />
          <rect x="3" y="4" width="14" height="10" rx="3" fill="#e6695b" />
          <rect x="3" y="4" width="14" height="5" rx="3" fill="#ff8ba7" />
        </svg>
      );
    case 'tree':
      return (
        <svg viewBox="0 0 30 40" className="w-8 h-10">
          <rect x="13" y="28" width="4" height="12" fill="#8B6914" />
          <polygon points="15,4 4,28 26,28" fill="#2cb67d" />
          <polygon points="15,12 7,30 23,30" fill="#209869" />
        </svg>
      );
    case 'dog':
      return (
        <svg viewBox="0 0 24 20" className="w-6 h-5">
          <ellipse cx="12" cy="14" rx="8" ry="5" fill="#d6c1ac" />
          <circle cx="8" cy="10" r="4" fill="#e6d9ce" />
          <circle cx="7" cy="9" r="1" fill="#272343" />
          <polygon points="5,6 3,2 7,5" fill="#d6c1ac" />
          <polygon points="11,6 13,2 9,5" fill="#d6c1ac" />
          <ellipse cx="7.5" cy="11" rx="1.5" ry="1" fill="#272343" />
        </svg>
      );
    case 'bench':
      return (
        <svg viewBox="0 0 32 20" className="w-8 h-5">
          <rect x="2" y="8" width="28" height="3" rx="1" fill="#8B6914" />
          <rect x="2" y="12" width="28" height="2" rx="1" fill="#A0782C" />
          <rect x="4" y="14" width="3" height="6" fill="#8B6914" />
          <rect x="25" y="14" width="3" height="6" fill="#8B6914" />
        </svg>
      );
    case 'lamp':
      return (
        <svg viewBox="0 0 16 36" className="w-4 h-9">
          <rect x="7" y="12" width="2" height="24" fill="#4a5568" />
          <circle cx="8" cy="8" r="6" fill="#f6ad55" opacity="0.6" />
          <circle cx="8" cy="8" r="3" fill="#f6ad55" />
          <rect x="5" y="10" width="6" height="3" rx="1" fill="#4a5568" />
        </svg>
      );
    default:
      return null;
  }
}

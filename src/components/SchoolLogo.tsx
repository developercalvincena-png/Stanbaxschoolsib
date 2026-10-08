import React from 'react';
import { useSchool } from '../context/SchoolContext';

interface SchoolLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  onClick?: () => void;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'auto',
  className = '',
  onClick
}) => {
  const { schoolInfo, images } = useSchool();
  const [imgError, setImgError] = React.useState(false);

  // Pixel dimensions based on size
  const sizeMap = {
    xs: { badge: 32, crest: 32, textTitle: 'text-xs', textSub: 'text-[9px]' },
    sm: { badge: 40, crest: 40, textTitle: 'text-sm', textSub: 'text-[10px]' },
    md: { badge: 52, crest: 52, textTitle: 'text-base sm:text-lg', textSub: 'text-xs' },
    lg: { badge: 68, crest: 68, textTitle: 'text-xl sm:text-2xl', textSub: 'text-sm' },
    xl: { badge: 92, crest: 92, textTitle: 'text-2xl sm:text-3xl', textSub: 'text-base' }
  };

  const dim = sizeMap[size];

  // Custom logo resolution (from schoolInfo.logoUrl, or custom uploaded image in images.crest)
  const customLogoUrl = schoolInfo?.logoUrl || 
    (images?.crest && !images.crest.includes('photo-1546410531-bb4caa6b424d') ? images.crest : undefined);

  // Authentic British-Nigerian School Crest Emblem matching Uniform Colors (Cream, Black, Yellow, Red)
  const DefaultSvgCrest = (
    <svg
      viewBox="0 0 120 120"
      className="w-full h-full drop-shadow-md"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Stanbax Schools Crest"
    >
      {/* Outer Circular Rim - School Deep Black with Gold/Yellow Border */}
      <circle cx="60" cy="60" r="58" fill="#111827" stroke="#EAB308" strokeWidth="4" />
      
      {/* Concentric Yellow/Gold Dash Ring */}
      <circle cx="60" cy="60" r="51" stroke="#FACC15" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.9" />

      {/* Outer Text Path Arc - STANBAX SCHOOLS IBADAN */}
      <path
        id="crestTextArcTop"
        d="M 22 60 A 38 38 0 0 1 98 60"
        fill="none"
      />
      <text className="font-black text-[9.5px] uppercase fill-amber-300 tracking-wider">
        <textPath href="#crestTextArcTop" startOffset="50%" textAnchor="middle">
          {schoolInfo?.shortName?.toUpperCase() || 'STANBAX SCHOOLS'}
        </textPath>
      </text>

      {/* Heraldic Shield in Center */}
      <g transform="translate(30, 36) scale(0.5)">
        {/* Shield Base - Cream (#FFFDF5) */}
        <path
          d="M 60 10 Q 110 10 110 50 Q 110 100 60 125 Q 10 100 10 50 Q 10 10 60 10 Z"
          fill="#FFFDF5"
          stroke="#111827"
          strokeWidth="5"
        />

        {/* Top Left Quadrant - School Red (#DC2626) */}
        <path
          d="M 60 10 Q 15 10 15 50 L 60 50 Z"
          fill="#DC2626"
        />

        {/* Bottom Right Quadrant - School Red (#DC2626) */}
        <path
          d="M 60 50 L 105 50 Q 100 95 60 120 Z"
          fill="#DC2626"
        />

        {/* Gold Cross Divider */}
        <line x1="10" y1="50" x2="110" y2="50" stroke="#EAB308" strokeWidth="6" />
        <line x1="60" y1="10" x2="60" y2="125" stroke="#EAB308" strokeWidth="6" />

        {/* Heraldic Symbols: */}
        {/* 1. Open Book of Knowledge (Top Left) */}
        <path
          d="M 28 32 Q 36 28 42 33 L 42 42 Q 36 38 28 41 Z"
          fill="#FFFDF5"
        />
        <path
          d="M 52 32 Q 44 28 38 33 L 38 42 Q 44 38 52 41 Z"
          fill="#FFFDF5"
        />

        {/* 2. Torch of Wisdom / Diligence (Top Right) */}
        <path
          d="M 85 24 L 82 38 L 88 38 Z"
          fill="#EAB308"
        />
        <circle cx="85" cy="20" r="4" fill="#DC2626" />

        {/* 3. Quill / Integrity (Bottom Left) */}
        <path
          d="M 32 65 Q 40 75 48 85 L 43 86 Q 37 76 30 68 Z"
          fill="#111827"
        />

        {/* 4. Graduation Cap (Bottom Right) */}
        <polygon points="75,70 88,64 101,70 88,76" fill="#FFFDF5" />
        <polygon points="82,75 82,82 94,82 94,75" fill="#FFFDF5" />
      </g>

      {/* Lower Banner Ribbon - School Red (#DC2626) with Gold Border */}
      <path
        d="M 20 90 L 30 84 L 60 87 L 90 84 L 100 90 L 92 100 L 60 97 L 28 100 Z"
        fill="#DC2626"
        stroke="#FACC15"
        strokeWidth="1.5"
      />

      {/* Ribbon Motto Text */}
      <text
        x="60"
        y="94"
        textAnchor="middle"
        className="text-[6.5px] font-black fill-[#FFFDF5] tracking-widest uppercase"
      >
        DILIGENCE & INTEGRITY
      </text>

      {/* Year of Est - 2008 */}
      <text
        x="60"
        y="112"
        textAnchor="middle"
        className="text-[6.5px] font-bold fill-amber-400"
      >
        EST. 2008 • IBADAN
      </text>
    </svg>
  );

  const CrestBadge = (
    <div 
      className="relative flex items-center justify-center shrink-0" 
      style={{ width: dim.badge, height: dim.badge }}
    >
      {customLogoUrl && !imgError ? (
        <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-md border-2 border-amber-400 flex items-center justify-center p-0.5">
          <img
            src={customLogoUrl}
            alt={schoolInfo?.name || "School Crest Logo"}
            className="w-full h-full object-contain rounded-full"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        DefaultSvgCrest
      )}
    </div>
  );

  return (
    <div 
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:opacity-95' : ''} ${className}`}
      onClick={onClick}
    >
      {CrestBadge}

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight leading-none ${dim.textTitle} ${
              variant === 'light' 
                ? 'text-white' 
                : variant === 'dark' 
                ? 'text-neutral-900' 
                : 'text-neutral-900 group-hover:text-red-600 dark:text-white'
            }`}>
              {schoolInfo?.shortName || "Stanbax Schools"}
            </span>
          </div>

          <span className={`font-bold tracking-wider uppercase leading-tight ${dim.textSub} ${
            variant === 'light' 
              ? 'text-amber-300' 
              : 'text-red-700'
          }`}>
            Ibadan • College & Academics
          </span>

          <span className="text-[10px] text-neutral-500 font-medium hidden sm:inline-block leading-tight">
            Knowledge • Diligence • Integrity
          </span>
        </div>
      )}
    </div>
  );
};
export default SchoolLogo;

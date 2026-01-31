import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

// Brand Colors (As per your theme)
const DARK_BROWN = "#2C1810";
const BURNT_ORANGE = "#C1502E";
const OFF_WHITE_LIGHT = "#FFF6EE"; 
const SAFFRON = "#FF9933";

/**
 * Custom Icon: Bespoke AI
 * Visuals: A stylized sewing machine head that doubles as a computer terminal.
 */
const TailorBotIcon = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main Machine Body / Terminal */}
        <rect x="20" y="30" width="60" height="45" rx="4" stroke={DARK_BROWN} strokeWidth="5" fill="#1A0D08"/>
        
        {/* Needle / Stitching Line */}
        <motion.line 
          x1="50" y1="75" x2="50" y2="85" 
          stroke={BURNT_ORANGE} 
          strokeWidth="4" 
          animate={{ y: isHovered ? [0, 5, 0] : 0 }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />
        
        {/* Sewing Thread Reel (Top) */}
        <rect x="35" y="15" width="30" height="15" rx="2" fill={SAFFRON} stroke={DARK_BROWN} strokeWidth="2"/>
        <line x1="50" y1="30" x2="50" y2="15" stroke={DARK_BROWN} strokeWidth="3" />

        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.g key="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Scissors Icon for "Alteration/Cutting" feel */}
              <path d="M40 50L60 60M60 50L40 60" stroke={SAFFRON} strokeWidth="5" strokeLinecap="round"/>
              <circle cx="38" cy="48" r="3" stroke={SAFFRON} strokeWidth="2"/>
              <circle cx="38" cy="62" r="3" stroke={SAFFRON} strokeWidth="2"/>
            </motion.g>
          ) : (
            <motion.g key="hover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Binary/Code "Stitches" representing the AI Logic */}
              <foreignObject x="25" y="35" width="50" height="35">
                <div className="flex flex-col items-center justify-center h-full overflow-hidden">
                  <motion.div 
                    animate={{ y: [0, -40] }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
                    className="text-[6px] font-mono text-[#27C93F] leading-tight text-center"
                  >
                    {"10101\nSTITCH\nORDER\nREADY\n11001\nALTER\nDONE"}
                  </motion.div>
                </div>
              </foreignObject>
            </motion.g>
          )}
        </AnimatePresence>
        
        {/* Base Plate */}
        <rect x="15" y="75" width="70" height="6" rx="3" fill={DARK_BROWN}/>
    </svg>
  );
};

interface ChatbotIconProps {
  onClick: () => void;
}

export default function ChatbotIcon({ onClick }: ChatbotIconProps) {
  const [hovered, setHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (!hovered) {
      controls.start({ y: [0, -8, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } });
    } else {
      controls.start({ scale: 1.05, transition: { duration: 0.2 } });
    }
  }, [hovered, controls]);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="mb-4 bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-[11px] font-mono border-l-4 border-[#C1502E] shadow-lg rounded-sm"
          >
            <div className="flex flex-col">
              <span className="opacity-50 text-[8px] uppercase tracking-widest">Bespoke AI</span>
              <span className="font-bold">Let's craft your style.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={controls}
        className="relative p-2 border-[3px] transition-all duration-300 shadow-2xl"
        style={{ 
          borderColor: DARK_BROWN, 
          backgroundColor: hovered ? "#FFFFFF" : OFF_WHITE_LIGHT,
          borderRadius: "16px",
          boxShadow: hovered 
            ? `10px 10px 0px ${BURNT_ORANGE}` 
            : `6px 6px 0px ${DARK_BROWN}`,
        }}
      >
        <div className="w-16 h-16 flex items-center justify-center">
             <TailorBotIcon isHovered={hovered} />
        </div>
      </motion.button>
    </div>
  );
}
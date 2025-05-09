import { useRef } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP);

interface EmojiProps {
  emoji: string;
  size: number;
  row: number;
  col: number;
  blur: number;
  opacity: number;
  skewX: number;
  skewY: number;
}

export default function WelcomePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const emojisRef = useRef<EmojiProps[]>([]);

  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  };

  const generateEmojis = () => {
    const freightEmojis = [
      "🚢",
      "🚛",
      "📦",
      "🚚",
      "🛳️",
      "✈️",
      "🚂",
      "🚆",
      "🚁",
      "🏭",
      "📱",
      "💻",
      "📟",
      "📋",
      "📊",
      "📈",
      "💰",
      "💳",
      "💲",
      "🏦",
    ];
    const emojiArray: EmojiProps[] = [];
    const gridSize = 10;

    const emojiGrid: Record<string, string> = {};

    const getUniqueEmoji = (row: number, col: number): string => {
      const neighborPositions = [
        `${row - 2}_${col}`, // Top
        `${row + 2}_${col}`, // Bottom
        `${row}_${col - 2}`, // Left
        `${row}_${col + 2}`, // Right
        `${row - 2}_${col - 2}`, // Top-left
        `${row - 2}_${col + 2}`, // Top-right
        `${row + 2}_${col - 2}`, // Bottom-left
        `${row + 2}_${col + 2}`, // Bottom-right
      ];

      const neighborEmojis = neighborPositions
        .map((pos) => emojiGrid[pos])
        .filter((emoji) => emoji !== undefined);

      const availableEmojis = freightEmojis.filter(
        (emoji) => !neighborEmojis.includes(emoji)
      );

      const chosenEmoji =
        availableEmojis.length > 0
          ? availableEmojis[Math.floor(Math.random() * availableEmojis.length)]
          : freightEmojis[Math.floor(Math.random() * freightEmojis.length)];

      emojiGrid[`${row}_${col}`] = chosenEmoji;

      return chosenEmoji;
    };

    for (let row = -5; row <= gridSize + 5; row += 2) {
      for (let col = -5; col <= gridSize + 5; col += 2) {
        const size = Math.random() * 20 + 25; // 25-45px
        const blur = 2.5 - ((size - 25) / 20) * 2;

        emojiArray.push({
          emoji: getUniqueEmoji(row, col),
          size: size,
          row: row,
          col: col,
          blur: blur,
          opacity: Math.random() * 0.5 + 0.1,
          skewX: Math.random() * 6 - 3,
          skewY: Math.random() * 6 - 3,
        });
      }
    }

    return emojiArray;
  };

  if (emojisRef.current.length === 0) {
    emojisRef.current = generateEmojis();
  }

  const { contextSafe } = useGSAP(
    () => {
      let currentMouseX = 0;
      let currentMouseY = 0;
      let targetMouseX = 0;
      let targetMouseY = 0;

      const emojiElements = gsap.utils.toArray<HTMLDivElement>(".emoji-item");
      const originalSizes = emojisRef.current.map((emoji) => emoji.size);

      const updateParallax = () => {
        currentMouseX = lerp(currentMouseX, targetMouseX, 0.1);
        currentMouseY = lerp(currentMouseY, targetMouseY, 0.1);

        if (!containerRef.current) return;

        const { width, height } = containerRef.current.getBoundingClientRect();
        const baseMovementAmount = Math.min(width, height) * 0.03;
        const distanceFromCenter = Math.sqrt(
          currentMouseX * currentMouseX + currentMouseY * currentMouseY
        );
        const normalizedDistance = Math.min(distanceFromCenter, 1);

        emojiElements.forEach((element, index) => {
          const emoji = emojisRef.current[index];
          const originalSize = originalSizes[index];

          const sizeFactor = 2 - (originalSize - 25) / 20;

          gsap.to(element, {
            x: -currentMouseX * baseMovementAmount * sizeFactor,
            y: -currentMouseY * baseMovementAmount * sizeFactor,
            fontSize: `${
              originalSize * (1 + 0.08 * (1 - normalizedDistance))
            }px`,
            skewX: emoji.skewX + currentMouseX * 8,
            skewY: emoji.skewY + currentMouseY * 8,
            duration: 0.6,
            ease: "power1.out",
            overwrite: "auto",
          });
        });

        requestAnimationFrame(updateParallax);
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const { width, height } = containerRef.current.getBoundingClientRect();
        targetMouseX = (e.clientX / width) * 2 - 1;
        targetMouseY = (e.clientY / height) * 2 - 1;
      };

      const hasMouseInput = window.matchMedia("(pointer: fine)").matches;
      const animationFrame = requestAnimationFrame(updateParallax);

      if (hasMouseInput) {
        window.addEventListener("mousemove", handleMouseMove);
      } else {
        let angle = 0;
        const autoAnimate = () => {
          angle += 0.005;
          targetMouseX = Math.sin(angle) * 0.3;
          targetMouseY = Math.cos(angle) * 0.3;
          requestAnimationFrame(autoAnimate);
        };
        const autoAnimationFrame = requestAnimationFrame(autoAnimate);

        return () => cancelAnimationFrame(autoAnimationFrame);
      }

      return () => {
        if (hasMouseInput) {
          window.removeEventListener("mousemove", handleMouseMove);
        }
        cancelAnimationFrame(animationFrame);
      };
    },
    { scope: containerRef }
  );

  const handleGetStarted = contextSafe(() => {
    const goToDashboard = () => {
      navigate("/shipments");
      return;
    };

    const button = containerRef.current?.querySelector("button");
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: goToDashboard,
      });
    } else {
      goToDashboard();
    }
  });

  return (
    <div
      ref={containerRef}
      className="flex min-h-dvh flex-col items-center justify-center bg-background relative overflow-hidden"
    >
      {/* Emoji background with parallax effect */}
      <div
        className="absolute pointer-events-none"
        style={{
          transform: "rotate(-10deg) scale(1.5)",
          top: "-25%",
          left: "-25%",
          width: "150%",
          height: "150%",
        }}
      >
        {emojisRef.current.map((emoji, index) => (
          <div
            key={index}
            className="emoji-item absolute pointer-events-none"
            style={{
              fontSize: `${emoji.size}px`,
              top: `${((emoji.row + 5) / 20) * 100}%`,
              left: `${((emoji.col + 5) / 20) * 100}%`,
              filter: `blur(${emoji.blur}px)`,
              opacity: emoji.opacity,
              transform: `skew(${emoji.skewX}deg, ${emoji.skewY}deg)`,
              zIndex: 0,
            }}
          >
            {emoji.emoji}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center space-y-6 text-center z-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to FreightFixer
        </h1>
        <p className="text-muted-foreground">
          Your all-in-one solution for freight management
        </p>
        <Button size="lg" onClick={handleGetStarted}>
          Get Started
        </Button>
      </div>
    </div>
  );
}

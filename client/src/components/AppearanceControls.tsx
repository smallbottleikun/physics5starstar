import { Minus, Moon, Plus, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface AppearanceControlsProps {
  compact?: boolean;
}

export default function AppearanceControls({ compact = false }: AppearanceControlsProps) {
  const { theme, setTheme, readingScale, setReadingScale } = useTheme();
  const decreaseReadingScale = () => {
    setReadingScale(readingScale === "large" ? "normal" : "small");
  };
  const increaseReadingScale = () => {
    setReadingScale(readingScale === "small" ? "normal" : "large");
  };

  return (
    <div className={`appearance-controls ${compact ? "appearance-controls-compact" : ""}`} aria-label="Appearance controls">
      <div className="appearance-group" aria-label="Colour mode">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`appearance-button ${theme === "light" ? "is-active" : ""}`}
          aria-label="Switch to day mode"
          aria-pressed={theme === "light"}
          title="日間模式"
        >
          <Sun size={14} strokeWidth={1.8} />
          {!compact && <span>日間</span>}
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`appearance-button ${theme === "dark" ? "is-active" : ""}`}
          aria-label="Switch to night mode"
          aria-pressed={theme === "dark"}
          title="夜間模式"
        >
          <Moon size={14} strokeWidth={1.8} />
          {!compact && <span>夜間</span>}
        </button>
      </div>

      <div className="appearance-group" aria-label="Text size">
        <button
          type="button"
          onClick={decreaseReadingScale}
          className={`appearance-button icon-button ${readingScale === "small" ? "is-active" : ""}`}
          aria-label="Decrease text size"
          aria-pressed={readingScale === "small"}
          title="縮小文字"
        >
          <Minus size={14} strokeWidth={2} />
          <span className="appearance-a">A</span>
        </button>
        <button
          type="button"
          onClick={increaseReadingScale}
          className={`appearance-button icon-button ${readingScale === "large" ? "is-active" : ""}`}
          aria-label="Increase text size"
          aria-pressed={readingScale === "large"}
          title="放大文字"
        >
          <span className="appearance-a appearance-a-small">A</span>
          <Plus size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

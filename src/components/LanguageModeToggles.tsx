import { Accessibility } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LANGUAGES, type Language } from "@/i18n/translations";

interface Props {
  compact?: boolean;
  onDark?: boolean;
}

export const LanguageModeToggles = ({ compact = false, onDark = false }: Props) => {
  const { lang, setLang, simpleMode, toggleSimpleMode, t } = useTranslation();

  const baseText = onDark ? "text-white/70" : "text-foreground/70";
  const activeText = onDark ? "text-white" : "text-foreground";
  const hoverText = onDark ? "hover:text-white" : "hover:text-foreground";
  const iconBtn = onDark
    ? "p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
    : "p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors";

  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}>
      <div
        className={`flex items-center text-[12px] font-medium tabular-nums select-none ${baseText}`}
        role="group"
        aria-label="Language"
      >
        {LANGUAGES.map((l, i) => (
          <span key={l.code} className="flex items-center">
            {i > 0 && <span className={`mx-1.5 opacity-40`}>|</span>}
            <button
              onClick={() => setLang(l.code as Language)}
              className={`transition-colors ${hoverText} ${lang === l.code ? `${activeText} font-semibold` : ""}`}
              aria-pressed={lang === l.code}
              aria-label={`Switch to ${l.label}`}
            >
              {l.label}
            </button>
          </span>
        ))}
      </div>

      <button
        onClick={toggleSimpleMode}
        className={`${iconBtn} ${simpleMode ? (onDark ? "bg-white/15 text-white" : "bg-secondary text-foreground") : ""}`}
        aria-pressed={simpleMode}
        aria-label={t("simple.mode_label")}
        title={t("simple.mode_label")}
      >
        <Accessibility size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
};

export default LanguageModeToggles;

import { useState } from "react";
import { HelpCircle, X, ShoppingBag, Tag, Mail } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const MARKETING_ROUTES = new Set(["/", "/landing", "/auth", "/faq", "/support", "/terms", "/privacy"]);

export const SimpleModeHelp = () => {
  const { simpleMode, t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!simpleMode) return null;
  if (MARKETING_ROUTES.has(location.pathname)) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-[60] inline-flex items-center gap-2 h-14 px-5 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity text-base font-medium"
        aria-label={t("simple.need_help")}
      >
        <HelpCircle size={22} strokeWidth={2} />
        {t("simple.need_help")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-background rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{t("simple.need_help")}</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-secondary"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { icon: ShoppingBag, label: t("simple.help.how_buy"), href: "/faq" },
                { icon: Tag, label: t("simple.help.how_sell"), href: "/seller-onboarding" },
                { icon: Mail, label: t("simple.help.contact"), href: "/support" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-4 w-full min-h-[56px] px-5 rounded-xl border border-border hover:bg-secondary transition-colors text-lg font-medium"
                >
                  <Icon size={22} strokeWidth={1.75} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleModeHelp;

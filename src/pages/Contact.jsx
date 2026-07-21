import { motion } from "framer-motion";
import { Mail, Link2, ExternalLink } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";

const contactLinks = [
  {
    label: "Email",
    value: "sina10dalaei@gmail.com",
    href: "mailto:sina10dalaei@gmail.com",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sinadalaei",
    href: "https://linkedin.com/in/sinadalaei",
    icon: Link2,
    external: true,
  },
  {
    label: "Behance",
    value: "behance.net/sinadalaei1",
    href: "https://behnace.net/sinadalaei1",
    icon: ExternalLink,
    external: true,
  },
];

export default function Contact() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="page-shell min-h-screen">
      <div className="max-w-2xl mx-auto relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-160px] left-1/2 -translate-x-1/2 w-[min(100vw,500px)] h-[400px] bg-sky-400/10 blur-[160px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center mb-12 md:mb-16"
        >
          <p className="section-label">{t.navContact}</p>
          <h1 className="page-heading mb-4">Let's work together</h1>
          <p className="text-neutral-500 leading-relaxed">
            Available for freelance projects, collaborations, and full-time
            opportunities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative space-y-4"
        >
          {contactLinks.map(({ label, value, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="glass-card flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-white/40 dark:hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/30 dark:bg-white/10 flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs text-neutral-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium truncate">{value}</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors shrink-0">
                {external ? "Open →" : "Send →"}
              </span>
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass-card mt-8 p-8 text-center"
        >
          <p className="text-sm text-neutral-500 mb-6">
            Prefer a quick intro? Drop me a line with your project details.
          </p>
          <a
            href="mailto:sina10dalaei@gmail.com?subject=Project%20Inquiry"
            className="btn-primary"
          >
            Send an email
          </a>
        </motion.div>
      </div>
    </main>
  );
}

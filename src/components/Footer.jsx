import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="px-6 pt-16 pb-8 md:pt-20 md:pb-10">
      <div className="max-w-7xl mx-auto glass-card p-8 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="sm:col-span-1">
            <h3 className="text-xl font-semibold mb-2">Sina Dalaei</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              UI/UX Designer crafting modern digital experiences.
            </p>
          </div>

          <div>
            <p className="section-label">Connect</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href="https://linkedin.com/in/sinadalaei"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://behance.net/sinadalaei1"
                target="_blank"
                rel="noreferrer"
              >
                Behance
              </a>
              <a href="mailto:sina10dalaei@gmail.com">Email</a>
              <a href="/SinaDalaei-Resume.pdf" download>
                Resume
              </a>
            </div>
          </div>

          <div>
            <p className="section-label">Navigation</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link to="/works">Works</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      <p className="max-w-7xl mx-auto mt-8 text-xs text-neutral-500 text-center">
        © 2026 Sina Dalaei. All rights reserved.
      </p>
    </footer>
  );
}

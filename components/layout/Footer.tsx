import {
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaFacebook,
} from "react-icons/fa6";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#181828] text-white pt-10 pb-6 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#23233a] pb-8 mb-8 gap-6">
          <span className="font-bold text-3xl md:text-4xl">Transformik AI</span>
          <div className="flex gap-6 text-2xl">
            <a
              href="https://youtube.com"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://twitter.com"
              aria-label="X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          {/* About Section */}
          <div className="md:pr-12">
            <h3 className="font-semibold text-xl mb-3">About Transformik AI</h3>
            <p className="text-white mb-4 leading-relaxed">
              Discover cutting-edge AI tools and resources to transform your
              workflow. From AI generators to productivity enhancers, we curate
              the best artificial intelligence solutions for creators and
              professionals.
            </p>
            <p className="text-white text-sm">
              Contact:{" "}
              <a href="mailto:shubhampatel0513@gmail.com" className="underline">
                shubhampatel0513@gmail.com
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:px-8">
            <h3 className="font-semibold text-xl mb-3">Quick Links</h3>
            <ul className="space-y-2 text-white">
              <li>
                <Link href="/blog">All Tools</Link>
              </li>
              <li>
                <Link href="/tools/submit">All Categories</Link>
              </li>
              <li>
                <Link href="/tools">Blogs</Link>
              </li>
            </ul>
          </div>

          {/* Top Categories */}
          <div className="md:pl-12">
            <h3 className="font-semibold text-xl mb-3">Top AI Categories</h3>
            <ul className="space-y-2 text-white">
              <li>AI Video Generation</li>
              <li>AI Image Generation</li>
              <li>NSFW Chat</li>
            </ul>
            <Link
              href="/categories"
              className="font-semibold text-white flex items-center gap-2 mt-3"
            >
              All AI Categories <span>→</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-12">
          <div className="flex items-center gap-3 mb-4">
          </div>
          <div className="text-center text-[#8ca0b3] text-sm">
            © {new Date().getFullYear()} Transformik AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

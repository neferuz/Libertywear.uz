import { motion } from 'motion/react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

export function UrbanFooter() {

  const footerSections = [
    {
      title: 'SHOP',
      links: ['Women', 'Men', 'Kids', 'Accessories', 'New Arrivals', 'Sale'],
    },
    {
      title: 'HELP',
      links: ['Customer Service', 'My Account', 'Store Finder', 'FAQs', 'Size Guide', 'Returns', 'Contact Us'],
    },
    {
      title: 'ABOUT',
      links: ['About Us', 'Careers', 'Sustainability', 'Press', 'Gift Cards', 'Affiliate'],
    },
  ];

  return (
    <footer className="bg-[#2c3b6e] text-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div>
            <h3 className="text-xl tracking-[0.15em] mb-4">LIBERTY</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Premium fashion for the modern lifestyle. Quality clothing and accessories that
              define your style.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Youtube, href: '#' },
              ].map(({ Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-xs tracking-[0.15em] mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => {
                  let href = `#${link.toLowerCase().replace(/\s+/g, '-')}`;
                  if (link === 'Contact Us') href = '/contact';
                  else if (link === 'About Us') href = '/about';
                  else if (link === 'FAQs') href = '/faq';
                  return (
                    <li key={linkIndex}>
                      <Link
                        href={href}
                        className="text-sm text-white/60 hover:text-white transition-colors block"
                      >
                        <motion.span
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          {link}
                        </motion.span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="text-xs text-white/40 tracking-wide">WE ACCEPT:</span>
            {['VISA', 'MASTERCARD', 'AMEX', 'PAYPAL'].map((method, index) => (
              <span
                key={index}
                className="text-xs tracking-wider text-white/60 border border-white/20 px-3 py-1"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-white/40 tracking-wide">
          <p>© 2025 LIBERTY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
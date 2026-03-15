'use client';
import { CONTACT_INFO } from '@/lib/data/config';

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer
            className="pt-16 pb-8"
            style={{ background: 'var(--color-charcoal)', color: 'rgba(245,239,224,0.7)' }}
        >
            <div className="container-site">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b" style={{ borderColor: 'rgba(245,239,224,0.08)' }}>

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                                <rect width="36" height="36" rx="6" fill="rgba(245,239,224,0.1)" />
                                <path d="M18 4L30 10V20L18 32L6 20V10L18 4Z" fill="url(#fg)" fillOpacity="0.9" />
                                <path d="M18 10L24 13.5V20.5L18 26L12 20.5V13.5L18 10Z" fill="#2C2416" />
                                <path d="M18 14L22 16.5V21.5L18 24L14 21.5V16.5L18 14Z" fill="url(#fg)" />
                                <defs>
                                    <linearGradient id="fg" x1="6" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#D4A84B" /><stop offset="1" stopColor="#8A6318" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div>
                                <div className="font-display font-semibold text-lg" style={{ color: '#F5EFE0' }}>AMS Interiors</div>
                                <div className="text-xs tracking-wide" style={{ color: 'var(--color-brass-light)' }}>Love to Make Designs & Ideas</div>
                            </div>
                        </div>
                        <address className="not-italic text-sm leading-relaxed mb-4" style={{ color: 'rgba(245,239,224,0.6)' }}>
                            72-A, Main Road Jagat Puri, Shahdara<br />
                            New Delhi – 110051, India
                        </address>
                        <div className="flex flex-col gap-2 text-sm">
                            <a href={`tel:${CONTACT_INFO.phone1}`} className="flex items-center gap-2 transition-colors hover:text-brass" style={{ color: 'var(--color-brass-light)' }}>
                                <PhoneIcon /> {CONTACT_INFO.phone1Display}
                            </a>
                            <a href={`tel:${CONTACT_INFO.phone2}`} className="flex items-center gap-2 transition-colors hover:text-brass" style={{ color: 'var(--color-brass-light)' }}>
                                <PhoneIcon /> {CONTACT_INFO.phone2Display}
                            </a>
                            <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-brass" style={{ color: 'var(--color-brass-light)' }}>
                                <WAIcon /> WhatsApp
                            </a>
                        </div>
                        {/* Social icons */}
                        <div className="flex gap-3 mt-6">
                            {[
                                { label: "Instagram", href: "#", icon: <IGIcon /> },
                                { label: "Facebook", href: "#", icon: <FBIcon /> },
                                { label: "Justdial", href: "https://www.justdial.com", icon: <span className="text-xs font-bold">JD</span> },
                                { label: "TradeIndia", href: "https://www.tradeindia.com", icon: <span className="text-xs font-bold">TI</span> },
                            ].map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                                    style={{ background: 'rgba(245,239,224,0.08)', color: 'var(--color-brass-light)' }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 tracking-wide" style={{ color: '#F5EFE0' }}>Services</h4>
                        <ul className="space-y-2.5 text-sm">
                            {['Modular Kitchens', 'Wardrobes', 'Interior Design', 'False Ceilings', 'Renovation', 'Painting', 'Office Interiors'].map((s) => (
                                <li key={s}>
                                    <a href="#interiors" className="transition-colors" style={{ color: 'rgba(245,239,224,0.55)' }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-brass-light)'; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,239,224,0.55)'; }}
                                    >{s}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Gallery Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 tracking-wide" style={{ color: '#F5EFE0' }}>Gallery</h4>
                        <ul className="space-y-2.5 text-sm">
                            {['Kitchen Projects', 'Bedroom Interiors', 'Living Rooms', 'Office Spaces', 'Washrooms', 'False Ceilings'].map((g) => (
                                <li key={g}>
                                    <a href="#gallery" className="transition-colors" style={{ color: 'rgba(245,239,224,0.55)' }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-brass-light)'; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,239,224,0.55)'; }}
                                    >{g}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs" style={{ color: 'rgba(245,239,224,0.3)' }}>
                        © {year} AMS Interiors. GST: 07BWGPA2702L1ZT · All rights reserved.
                    </p>
                    <p className="text-xs text-center" style={{ color: 'rgba(245,239,224,0.3)' }}>
                        Site imagery courtesy of AMS Interiors — Jagat Puri (source: company gallery, Justdial, TradeIndia)
                    </p>
                </div>
            </div>
        </footer>
    );
}

const PhoneIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" />
    </svg>
);
const WAIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);
const IGIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
const FBIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
);

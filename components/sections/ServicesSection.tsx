'use client';
import { useEffect } from 'react';
import { services } from '@/lib/data/services';
import ServiceBlock from './ServiceBlock';
import { useAppStore } from '@/lib/store/useAppStore';

export default function ServicesSection() {
    const setActiveSection = useAppStore(s => s.setActiveSection);

    useEffect(() => {
        // Scroll spy for services
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: '-30% 0px -60% 0px' });

        services.forEach(s => {
            const el = document.getElementById(s.anchor);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [setActiveSection]);

    return (
        <section>
            {services.map((service, idx) => (
                <ServiceBlock key={service.id} service={service} index={idx} />
            ))}
        </section>
    );
}

'use client';
import { services } from '@/lib/data/services';
import ServiceBlock from './ServiceBlock';

export default function ServicesSection() {
    return (
        <section aria-label="Our services">
            {services.map((service, idx) => (
                <ServiceBlock key={service.id} service={service} index={idx} />
            ))}
        </section>
    );
}

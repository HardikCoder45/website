'use client';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const phoneRegex = /^[6-9]\d{9}$/;

const leadSchema = z.object({
    name: z.string().min(2, 'Name is required').max(50),
    phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian phone number'),
    service: z.string().min(1, 'Please select a service'),
    locality: z.string().min(3, 'Locality is required').max(100),
    area: z.string().optional(),
    whatsappOptIn: z.boolean(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
    onSuccess?: () => void;
    defaultService?: string;
}

export default function LeadForm({ onSuccess, defaultService }: LeadFormProps) {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const formRef = useRef<HTMLFormElement>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            service: defaultService || '',
            whatsappOptIn: true,
        }
    });

    useGSAP(() => {
        if (!formRef.current) return;
        const items = formRef.current.querySelectorAll('.form-item-anim');

        gsap.fromTo(items,
            { opacity: 0, x: -20 },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: formRef.current,
                    start: "top 90%",
                }
            }
        );
    }, { scope: formRef });

    const onSubmit = async (data: LeadFormValues) => {
        setStatus('submitting');

        // Simulate a small delay for premium feels
        await new Promise(resolve => setTimeout(resolve, 800));

        console.log("Lead captured:", data);

        // Construct WhatsApp Message
        const message = `Namaste AMS Interiors! %0A%0A I would like to book a Free Site Visit. %0A%0A *Name:* ${data.name} %0A *Phone:* ${data.phone} %0A *Service:* ${data.service} %0A *Locality:* ${data.locality}`;
        const waUrl = `https://wa.me/917840005522?text=${message}`;

        setStatus('success');

        // Redirect to WhatsApp after showing success state for a moment
        setTimeout(() => {
            window.open(waUrl, '_blank');
            if (onSuccess) onSuccess();
        }, 1500);
    };

    const submitBtnRef = useRef<HTMLButtonElement>(null);

    // Magnetic Button Effect
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!submitBtnRef.current) return;
        const rect = submitBtnRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(submitBtnRef.current, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.6,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        gsap.to(submitBtnRef.current, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)"
        });
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-20 h-20 rounded-full bg-brass/10 border border-brass flex items-center justify-center mb-6 scale-up-anim">
                    <svg width="40" height="40" fill="none" stroke="var(--color-brass-dark)" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h3 className="text-3xl font-display font-bold mb-2 text-charcoal">All Set!</h3>
                <p className="text-mute mb-6 max-w-sm">
                    Opening WhatsApp to connect you with our lead designer...
                </p>
                <div className="w-12 h-1 bg-brass/20 rounded-full overflow-hidden">
                    <div className="h-full bg-brass animate-loading-bar" />
                </div>
            </div>
        );
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5 form-item-anim opacity-0">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-mute ml-1">Full Name *</label>
                <input
                    {...register('name')}
                    type="text"
                    placeholder="Enter your name"
                    className={`w-full bg-white border px-5 py-4 rounded-2xl focus-visible:outline-none focus:ring-2 focus:ring-brass/30 text-charcoal font-medium placeholder:text-mute/50 transition-all ${errors.name ? 'border-error' : 'border-black/10'}`}
                />
                {errors.name && <p className="text-[10px] text-error font-bold mt-1 ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5 form-item-anim opacity-0">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-mute ml-1">Phone Number *</label>
                <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/40 text-sm font-bold">+91</span>
                    <input
                        {...register('phone')}
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        className={`w-full bg-white border pl-14 pr-5 py-4 rounded-2xl focus-visible:outline-none focus:ring-2 focus:ring-brass/30 text-charcoal font-medium placeholder:text-mute/50 transition-all ${errors.phone ? 'border-error' : 'border-black/10'}`}
                    />
                </div>
                {errors.phone && <p className="text-[10px] text-error font-bold mt-1 ml-1">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 form-item-anim opacity-0">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-mute ml-1">Interested In *</label>
                    <div className="relative">
                        <select
                            {...register('service')}
                            className={`w-full bg-white border px-5 py-4 rounded-2xl focus-visible:outline-none focus:ring-2 focus:ring-brass/30 text-charcoal font-medium appearance-none transition-all ${errors.service ? 'border-error' : 'border-black/10'}`}
                        >
                            <option value="">Select Service</option>
                            <option value="Modular Kitchen">Modular Kitchen</option>
                            <option value="Wardrobe">Wardrobes</option>
                            <option value="Full Home Interior">Full Home Interior</option>
                            <option value="False Ceiling">False Ceiling</option>
                            <option value="Bathroom Renovation">Bathroom Renovation</option>
                            <option value="General Enquiry">General Enquiry</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--color-mute)" strokeWidth="2"><path d="M2.5 4.5L6 8L9.5 4.5" /></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-mute ml-1">Locality in NCR *</label>
                    <input
                        {...register('locality')}
                        type="text"
                        placeholder="e.g. Noida Sector 15"
                        className={`w-full bg-white border px-5 py-4 rounded-2xl focus-visible:outline-none focus:ring-2 focus:ring-brass/30 text-charcoal font-medium placeholder:text-mute/50 transition-all ${errors.locality ? 'border-error' : 'border-black/10'}`}
                    />
                </div>
            </div>

            <label className="flex items-start gap-4 cursor-pointer pt-2 form-item-anim opacity-0">
                <div className="relative flex items-center mt-1">
                    <input
                        {...register('whatsappOptIn')}
                        type="checkbox"
                        className="w-5 h-5 rounded-lg border-black/10 text-brass focus:ring-brass/20 cursor-pointer"
                    />
                </div>
                <span className="text-[10px] text-mute font-medium leading-relaxed uppercase tracking-wider">
                    Get updates on WhatsApp. By clicking below, you agree to connect with our experts.
                </span>
            </label>

            <div className="form-item-anim opacity-0 pt-4">
                <button
                    ref={submitBtnRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    type="submit"
                    disabled={status === 'submitting'}
                    className="group w-full py-5 rounded-2xl text-white font-bold text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-15px_rgba(184,137,42,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(184,137,42,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    style={{ background: 'linear-gradient(135deg, var(--color-brass), var(--color-brass-dark))' }}
                >
                    {status === 'submitting' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>Confirm & Message on WhatsApp</span>
                            <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}


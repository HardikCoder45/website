export interface Testimonial {
    id: string;
    name: string;
    city: string;
    project: string;
    rating: number;
    quote: string;
    date: string;
    source: "IndiaMart" | "Justdial";
}

export const testimonials: Testimonial[] = [
    {
        id: "t1",
        name: "Jyotsna",
        city: "Delhi",
        project: "Aluminium Modular Kitchen",
        rating: 5,
        quote: "Project done on time with perfection. Really happy with the quality of work and the team's professionalism.",
        date: "Jan 2026",
        source: "IndiaMart",
    },
    {
        id: "t2",
        name: "Himanshu Verma",
        city: "Delhi",
        project: "Modular Kitchen",
        rating: 5,
        quote: "Kitchen best quality & best service. I am so happy with the results. The team finished everything in 15 days.",
        date: "Dec 2025",
        source: "IndiaMart",
    },
    {
        id: "t3",
        name: "Deepak Nagpal",
        city: "Noida",
        project: "Full Home Interior",
        rating: 5,
        quote: "Excellent work done in just 10 days. The craftsmen were skilled and kept the site clean throughout the project.",
        date: "Nov 2025",
        source: "IndiaMart",
    },
    {
        id: "t4",
        name: "Renu Verma",
        city: "Delhi",
        project: "L-Shaped Modular Kitchen",
        rating: 5,
        quote: "Outstanding work delivered on time. Very professional team, great quality materials. Highly recommended!",
        date: "Oct 2025",
        source: "IndiaMart",
    },
    {
        id: "t5",
        name: "S.K. Verma",
        city: "Delhi",
        project: "Wardrobe & TV Unit",
        rating: 5,
        quote: "Awesome experience. Very professional approach and affordable pricing. Will definitely recommend to friends.",
        date: "Sep 2025",
        source: "Justdial",
    },
    {
        id: "t6",
        name: "Shivani Ahuja",
        city: "Ghaziabad",
        project: "Kitchen Renovation",
        rating: 5,
        quote: "Excellent service from start to finish. The new modular kitchen looks amazing and functions perfectly.",
        date: "Oct 2025",
        source: "IndiaMart",
    },
    {
        id: "t7",
        name: "Pooja Ahuja",
        city: "Delhi",
        project: "3BHK Interior Design",
        rating: 5,
        quote: "Nice finishing work. Very detail-oriented team. The false ceiling and wardrobes turned out exactly as designed.",
        date: "Aug 2025",
        source: "IndiaMart",
    },
    {
        id: "t8",
        name: "Harish Gupta",
        city: "Noida",
        project: "L-Shaped Modular Kitchen",
        rating: 5,
        quote: "Superb quality work at a very competitive price. The HDHMR cabinets with Godrej hardware are solid and beautiful.",
        date: "Sep 2025",
        source: "IndiaMart",
    },
];

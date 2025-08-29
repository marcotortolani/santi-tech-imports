
'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FeaturedProducts } from '@/components/featured-products';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}

const HeroSection = () => {
    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    const images = [
        { src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Modern Tech 1", hint: "tech modern" },
        { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Technology Gadget", hint: "technology gadget" },
        { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Future Tech", hint: "future tech" },
        { src: "https://images.unsplash.com/photo-1612690669207-fed642192c40?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Minimalist Tech", hint: "minimalist tech" },
        { src: "https://images.unsplash.com/photo-1580786573431-f283d8bbacec?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Tech Setup", hint: "tech setup" },
        { src: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Smartphone Screen", hint: "smartphone screen" },
        { src: "https://images.unsplash.com/photo-1611926653670-e18689373857?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Gaming Setup", hint: "gaming setup" },
        { src: "https://images.unsplash.com/photo-1617864064479-f203fc7897c0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Camera Lens", hint: "camera lens" },
        { src: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=647&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Audio Gear", hint: "audio gear" },
        { src: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Laptop Workspace", hint: "laptop workspace" },
        { src: "https://plus.unsplash.com/premium_photo-1681147271469-662babeb9d39?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "VR Headset", hint: "vr headset" },
        { src: "https://images.unsplash.com/photo-1718485163549-7ea7ac742a6f?q=80&w=630&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Abstract Tech", hint: "abstract tech" },
        { src: "https://images.unsplash.com/photo-1696660760822-833afde62f94?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Circuit Board", hint: "circuit board" },
    ];

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl/none">
                                Tecnología que Impulsa tu Mundo
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                Descubre los últimos gadgets y dispositivos. Calidad y garantía en cada producto. La mejor tecnología, al mejor precio.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/productos">
                                    Explorar Productos
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <Carousel
                        plugins={[plugin.current]}
                        className="mx-auto overflow-hidden rounded-xl sm:w-full lg:order-last"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                        opts={{
                            loop: true,
                        }}
                    >
                        <CarouselContent>
                            {images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <Image
                                        alt={image.alt}
                                        className="aspect-video object-cover lg:aspect-square"
                                        height={550}
                                        src={image.src}
                                        width={550}
                                        data-ai-hint={image.hint}
                                        priority={index === 0}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">Lo que dicen nuestros clientes</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/40/40?random=1" data-ai-hint="person face" />
                            <AvatarFallback>JC</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>Juan Carlos</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">"Excelente atención y productos de primera. El iPhone que compré funciona a la perfección. ¡Totalmente recomendado!"</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/40/40?random=2" data-ai-hint="person face" />
                            <AvatarFallback>MP</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>Maria Paz</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">"Conseguí el modelo exacto que estaba buscando a un precio increíble. El proceso fue rápido y seguro. ¡Gracias Santi!"</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/40/40?random=3" data-ai-hint="person face" />
                            <AvatarFallback>LG</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>Luis Gomez</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">"La garantía me dio mucha confianza para comprar. El equipo llegó en perfectas condiciones. Muy profesionales."</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </section>
);

const ContactSection = () => (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">Contacto</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                <a href="tel:+541158340743" className="flex flex-col items-center gap-2 group">
                    <Phone className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                    <span className="text-muted-foreground">+54 11 5834-0743</span>
                </a>
                <div className="flex flex-col items-center gap-2">
                    <MapPin className="h-10 w-10 text-primary" />
                    <span className="text-muted-foreground">Buenos Aires, Argentina</span>
                </div>
            </div>
        </div>
    </section>
);

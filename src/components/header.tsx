import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetFooter, SheetTitle } from './ui/sheet';
import { Menu, Smartphone, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from './ui/separator';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Smartphone className="h-6 w-6" />
            <span className="font-bold sm:inline-block">
              Santi Techs
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center">
            <Button asChild variant="ghost">
              <Link href="/productos">
                Nuestros Productos
              </Link>
            </Button>
          </nav>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center space-x-2">
                      <Smartphone className="h-6 w-6" />
                      <span className="font-bold">Santi Techs</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-6">
                  <Link href="/productos" className="flex w-full items-center py-2 text-lg font-semibold">
                    Nuestros Productos
                  </Link>
                </div>
                <div className="flex-grow"></div>
                <Separator />
                <SheetFooter className="py-4">
                  <div className="flex flex-col items-center w-full gap-4 text-sm text-muted-foreground">
                    <a href="tel:+541158340743" className="flex items-center gap-2 group">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>+54 11 5834-0743</span>
                    </a>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Buenos Aires, Argentina</span>
                    </div>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

import type { Product } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Smartphone, MessageCircle, Camera, Aperture, Tablet, Laptop, Box } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

// Simple hash function to get a color from the brand name
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

// Function to generate a gradient based on the brand name
const getBrandGradient = (brand: string) => {
    const color = stringToColor(brand);
    // You can create a more complex gradient logic here if needed
    return `linear-gradient(135deg, ${color}99, ${color}44)`;
};

const ProductCategoryIcon = ({ category }: { category: string }) => {
  const iconProps = {
    className: "w-24 h-24 text-white/50 transition-transform duration-300 group-hover:scale-110"
  };

  switch (category.toLowerCase()) {
    case 'celulares':
      return <Smartphone {...iconProps} />;
    case 'cámaras':
      return <Camera {...iconProps} />;
    case 'lentes y flashes':
      return <Aperture {...iconProps} />;
    case 'ipads y tablets':
        return <Tablet {...iconProps} />;
    case 'macbooks e imacs':
        return <Laptop {...iconProps} />;
    case 'notebooks':
        return <Laptop {...iconProps} />;
    case 'varios':
        return <Box {...iconProps} />;
    default:
      return <Smartphone {...iconProps} />;
  }
};


export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = `U$D ${product.price.toLocaleString('de-DE')}`; 
  const phoneNumber = '+541158340743';
  const message = `Hola! Estoy interesado en el siguiente producto: ${product.category} - ${product.brand} - ${product.model} - Precio: U$D ${product.price.toLocaleString('de-DE')}`;
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  const brandGradient = getBrandGradient(product.brand);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
       <div className="aspect-[4/3] relative overflow-hidden group flex items-center justify-center" style={{ background: brandGradient }}>
          <ProductCategoryIcon category={product.category} />
       </div>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{product.model}</CardTitle>
        <CardDescription>{product.brand} / {product.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        {product.details && (
          <Badge variant="secondary">{product.details}</Badge>
        )}
        <p className="text-2xl font-bold text-green-400">{formattedPrice}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className='w-full bg-accent hover:bg-accent/90'>
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            Me Interesa
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

import { Brain, Heart } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t mb-10">
      <div className="container mx-auto flex flex-col items-center justify-center  md:h-24 md:flex-row  md:gap-4">
        <p className=" text-balance text-center text-sm leading-loose text-muted-foreground">
          © {new Date().getFullYear()} Santi Techs.{' '}
        </p>
        <p className=" text-balance text-center text-sm leading-loose text-muted-foreground">
          Todos los derechos reservados.
        </p>
      </div>
      <div className=" text-center text-slate-400">
        <p>Designed & Developed by Marco Tortolani</p>
        <div className="flex items-center justify-center gap-2">
          with <Brain className="h-5 w-5 text-sky-400" /> +{' '}
          <Heart className="h-5 w-5 text-red-500" />
        </div>
      </div>
    </footer>
  )
}

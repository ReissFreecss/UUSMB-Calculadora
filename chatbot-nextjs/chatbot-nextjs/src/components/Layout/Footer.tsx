import Image from 'next/image';

interface FooterProps {
  author: string;
}

export const Footer = ({ author }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow mt-4 py-4 sm:py-2">
      <div className="container mx-auto px-4">
        {/* Contenedor principal */}
        <div className="flex flex-col items-center justify-between space-y-4 lg:space-y-0 gap-2">
          {/* Logo y texto */}
          <div className="flex flex-col items-center space-y-2 lg:space-y-0 lg:space-x-4 gap-4">
            <Image
              src="/images/_LOGO_UUSMB.png" // Asegúrate de que la ruta sea correcta
              alt="Logo"
              width={1000}
              height={1000}
              className="h-8 lg:h-10 w-auto"
            />
            <p className="text-sm text-gray-600 text-center lg:text-left">
              &copy; {currentYear} {author}. Todos los derechos reservados.
            </p>
          </div>

          {/* Enlaces de navegación */}
          <nav className="flex flex-col items-center lg:flex-row lg:space-y-0 lg:space-x-4">
            <a
              href="https://docs.google.com/document/d/13y2f53h-gqNjbMMIG9DniM7EgULq4nr8/edit?usp=sharing&ouid=111799366496313445444&rtpof=true&sd=true"
              className="text-sm text-black hover:text-secondary-dark underline decoration-2 decoration-gray-600 hover:decoration-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Términos y Condiciones
            </a>
            <a
              href="http://www.uusmb.unam.mx/contacto.html"
              className="text-sm text-black hover:text-secondary-dark underline decoration-2 decoration-gray-600 hover:decoration-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contacto
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
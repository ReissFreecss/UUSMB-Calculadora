import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { inter } from '@/app/costos/ui/fonts';
import Image from 'next/image';

export default function UUSMBLogo() {
  return (
    <div
      className={`${inter.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/images/_ICON_UUSMB.png"
        width={1000}
        height={1000}
        alt="Logo"
        className="h-8 sm:h-10 w-auto"
      />
      <p className="text-[44px]"> UUSMB </p>
    </div>
  );
}

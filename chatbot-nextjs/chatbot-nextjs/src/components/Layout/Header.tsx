import Image from 'next/image';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="bg-white shadow mb-4 p-2 sm:p-4">
            <div className="container mx-auto flex items-center justify-between px-2 sm:px-4">
                <div className="flex items-center">
                    <Image
                        src="/images/_ICON_UUSMB.png"
                        alt="Logo"
                        width={1000}
                        height={1000}
                        className="h-8 sm:h-10 w-auto"
                    />
                    <h1 className="ml-2 sm:ml-4 text-xl font-bold text-black">
                        {title}
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
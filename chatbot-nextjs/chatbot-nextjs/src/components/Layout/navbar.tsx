'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 shadow-md bg-white transition-all duration-300">
            {/* Icono de menú en costos 
            {pathname.startsWith('/costos/dashboard') && (
                <IconButton onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800">
                    <MenuIcon fontSize='large' />
                </IconButton>
            )} */}

            {/* Logo */}
            <Link href="/" className="flex items-center text-xl font-semibold text-black">
                <Image src='/images/_ICON_UUSMB.png' width={40} height={40} alt='Logo' />
                <span className="ml-2 block md:hidden">UUSMB</span>
                <span className="ml-2 hidden md:block">Cotización de servicios del UUSMB</span>

            </Link>

            {/* Menú de navegación */}
            <div className="ml-auto flex items-center gap-4">
                {pathname === '/' && (
                    <>
                        <Link href='/calculadora'>
                            <Button>Usar calculadora</Button>
                        </Link>
                        <Link href='/login'>
                            <Button variant="outlined">Iniciar sesión</Button>
                        </Link>
                    </>
                )}

                {pathname === '/calculadora' && (
                    <Link href="/proyectos">
                        <Button>Proyectos</Button>
                    </Link>
                )}

                {pathname.startsWith('/costos') && (
                    <>
                        <Link href='/calculadora'>
                            <Button className='text-center'>
                                Usar calculadora
                            </Button>
                        </Link>
                        <Link href="/proyectos" className="font-medium hover:text-gray-200">
                            <Button>Proyectos</Button>
                        </Link>
                    </>
                )}
            </div>

            {pathname.startsWith('/proyectos') && (
                <>
                    <Link href='/calculadora'>
                        <Button className='text-center'>
                            Usar calculadora
                        </Button>
                    </Link>
                </>
            )}

            {/* Perfil de usuario */}
            {auth && (
                <div>
                    <IconButton onClick={handleMenu} color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Perfil</MenuItem>
                        <MenuItem onClick={handleClose}>Mi cuenta</MenuItem>
                    </Menu>
                </div>
            )}
        </nav>
    );
}

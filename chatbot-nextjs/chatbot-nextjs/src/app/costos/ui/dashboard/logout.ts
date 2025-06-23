'use server';

import { signOut } from 'next-auth/react'; // o tu lógica personalizada

export async function logout() {
  // Aquí va tu lógica para cerrar sesión
  await signOut(); // si usas next-auth
}

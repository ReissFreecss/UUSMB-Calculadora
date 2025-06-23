import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Aquí puedes seguir agregando tus configuraciones
};

export default nextConfig;

// Protección con middleware
export const config = {
  matcher: ['/costos/dashboard/:path*'],
};
"use client";


import React, { useState } from "react";
import Formulario from "@/components/features/Calculator/Form";
import { Footer } from '@/components/Layout/Footer';
import {WelcomeCalculator} from "@/components/features/Calculator/components/ui/WelcomeCalculator";


export default function Home() {
  return (
    <div className="container mx-auto flex-1 p-2 sm:p-4">
      
      <main>
      <WelcomeCalculator />
      <Formulario />
      </main>
      <Footer author="Unidad Universitaria de Secuenciación Masiva y Bioinformática" />

    </div>
  );
}

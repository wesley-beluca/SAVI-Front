import type { Component } from 'vue'
import {
  Baby,
  BookOpen,
  Briefcase,
  Car,
  Coffee,
  Dumbbell,
  Gamepad2,
  Gift,
  HeartPulse,
  Home,
  Music,
  PawPrint,
  PiggyBank,
  Plane,
  PlusCircle,
  Receipt,
  Shirt,
  ShoppingCart,
  Smartphone,
  Tag,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
} from '@lucide/vue'

// Os primeiros nomes espelham os ícones das categorias padrão (CategoriasPadraoSeed.cs).
const ICONES: Record<string, Component> = {
  'wallet': Wallet,
  'plus-circle': PlusCircle,
  'utensils': Utensils,
  'home': Home,
  'car': Car,
  'heart-pulse': HeartPulse,
  'gamepad-2': Gamepad2,
  'book-open': BookOpen,
  'tag': Tag,
  'shopping-cart': ShoppingCart,
  'shirt': Shirt,
  'plane': Plane,
  'paw-print': PawPrint,
  'gift': Gift,
  'baby': Baby,
  'briefcase': Briefcase,
  'trending-up': TrendingUp,
  'piggy-bank': PiggyBank,
  'smartphone': Smartphone,
  'zap': Zap,
  'coffee': Coffee,
  'dumbbell': Dumbbell,
  'music': Music,
  'receipt': Receipt,
}

export const NOMES_ICONES_CATEGORIA = Object.keys(ICONES)

export function iconeCategoria(nomeIcone: string): Component {
  return ICONES[nomeIcone] ?? Tag
}

import type { Component } from 'vue'
import { Car, Plane, ShieldCheck, Smartphone, Home, GraduationCap, Gift, PiggyBank } from '@lucide/vue'

export interface EstiloMeta {
  icone: string
  cor: string
}

const ICONES: Record<string, Component> = {
  'car': Car,
  'plane': Plane,
  'shield-check': ShieldCheck,
  'smartphone': Smartphone,
  'home': Home,
  'graduation-cap': GraduationCap,
  'gift': Gift,
  'piggy-bank': PiggyBank,
}

export const ESTILOS_META: EstiloMeta[] = [
  { icone: 'car', cor: '#F59E0B' },
  { icone: 'plane', cor: '#3B82F6' },
  { icone: 'shield-check', cor: '#16A34A' },
  { icone: 'smartphone', cor: '#6366F1' },
  { icone: 'home', cor: '#0EA5E9' },
  { icone: 'graduation-cap', cor: '#8B5CF6' },
  { icone: 'gift', cor: '#EC4899' },
  { icone: 'piggy-bank', cor: '#F97316' },
]

export function iconeMeta(nomeIcone: string): Component {
  return ICONES[nomeIcone] ?? PiggyBank
}

export const CORES_PRESET = ['#16A34A', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#0EA5E9', '#F97316']

export function corPorIndice(indice: number): string {
  return CORES_PRESET[indice % CORES_PRESET.length]!
}

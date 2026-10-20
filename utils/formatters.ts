export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarMesAno(data: Date): string {
  const texto = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(data)
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

const MESES_ABREVIADOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function formatarMesAbreviado(mes: number): string {
  return MESES_ABREVIADOS[mes - 1] ?? ''
}

export function formatarNomeMes(mes: number): string {
  const texto = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(2026, mes - 1, 1))
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function formatarDataGrupo(dataIso: string): string {
  const data = new Date(`${dataIso}T00:00:00`)
  const texto = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(data)
  return ehHoje(dataIso) ? `Hoje, ${texto}` : texto
}

export function formatarDataCurta(dataIso: string): string {
  const data = new Date(`${dataIso}T00:00:00`)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(data)
}

export function formatarDataCompleta(dataIso: string): string {
  const data = new Date(`${dataIso}T00:00:00`)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(data)
}

/** Data no fuso local como YYYY-MM-DD. `toISOString()` usa UTC e, à noite no Brasil, já devolve o dia seguinte. */
export function dataIsoLocal(data = new Date()): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${mes}-${dia}`
}

/** Hoje deslocado em `dias` (negativo para o passado), no fuso local, como YYYY-MM-DD. */
export function dataIsoDaquiA(dias: number): string {
  const data = new Date()
  data.setDate(data.getDate() + dias)
  return dataIsoLocal(data)
}

function ehHoje(dataIso: string): boolean {
  const hoje = new Date()
  const data = new Date(`${dataIso}T00:00:00`)
  return data.toDateString() === hoje.toDateString()
}

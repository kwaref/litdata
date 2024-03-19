// WEEKLY
export function agruparPorSemanas(list: any[]) {
  const result = list.reduce((acc, item) => {
    const date = new Date(item.date_created)
    // Obtener el número de la semana del año
    const week = getWeekNumber(date)

    if (!acc[week]) {
      acc[week] = {
        // label: `${startOfWeek(date).toLocaleDateString()} - ${endOfWeek(date).toLocaleDateString()}`,
        label: `${startOfWeek(date).toLocaleDateString('en-US', {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
        })}`,
        entries: [],
      }
    }

    acc[week].entries.push(item)

    return acc
  }, {})

  // Convertir el objeto en un arreglo de objetos
  return Object.values(result)
}
// Función auxiliar para obtener el número de la semana del año
function getWeekNumber(d: any) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  // @ts-ignore
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return d.getFullYear() + '-' + weekNo
}
// Funciones auxiliares para obtener el inicio y el fin de la semana
function startOfWeek(date: any) {
  const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
  return new Date(date.setDate(diff))
}
function endOfWeek(date: any) {
  const start = startOfWeek(date)
  return new Date(start.setDate(start.getDate() + 6))
}

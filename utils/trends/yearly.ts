// YEARLY
export function agruparPorAño(arreglo: any[]) {
  // Obtener todos los años posibles dentro del rango de fechas de los datos disponibles
  const años = obtenerAños(arreglo)

  // Agrupar los registros por año
  const agrupado = años
    .map(año => {
      // Filtrar los registros que pertenecen al año actual
      const registrosAño = arreglo.filter((item: any) => {
        const fechaItem = new Date(item.date_created)
        return fechaItem >= año.startDate && fechaItem <= año.endDate
      })

      // Si hay registros para este año, devolver el año con los registros, de lo contrario, devolver null
      return registrosAño.length > 0 ? {label: año.label, entries: registrosAño} : null
    })
    .filter(año => año !== null) // Eliminar años sin registros

  return agrupado
}
// Función para obtener todos los años posibles dentro del rango de fechas de los datos disponibles
function obtenerAños(arreglo: any[]) {
  const años = []

  // Obtener la fecha mínima y máxima de los registros
  const fechas = arreglo.map((item: any) => new Date(item.date_created))
  // @ts-ignore
  const fechaMinima = new Date(Math.min.apply(null, fechas))
  // @ts-ignore
  const fechaMaxima = new Date(Math.max.apply(null, fechas))

  // Obtener el año de la fecha mínima
  let year = fechaMinima.getFullYear()

  // Iterar sobre las fechas hasta alcanzar o superar la fecha máxima
  while (new Date(year, 0) <= fechaMaxima) {
    // Calcular la fecha de inicio y final del año
    const startDate = new Date(year, 0)
    const endDate = new Date(year, 11, 31)

    // Agregar el año al arreglo
    const año = {
      añoId: `${year}`,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      label: `${year}`,
      entries: [],
    }
    años.push(año)

    // Avanzar al siguiente año
    year++
  }

  return años
}

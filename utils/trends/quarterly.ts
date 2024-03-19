// QUARTERLY
export function agruparPorTrimestre(arreglo: any[]) {
  // Obtener todos los trimestres posibles dentro del rango de fechas de los datos disponibles
  const trimestres = obtenerTrimestres(arreglo)

  // Agrupar los registros por trimestre
  const agrupado = trimestres
    .map(trimestre => {
      // Filtrar los registros que pertenecen al trimestre actual
      const registrosTrimestre = arreglo.filter(item => {
        const fechaItem = new Date(item.date_created)
        return fechaItem >= trimestre.startDate && fechaItem <= trimestre.endDate
      })

      // Si hay registros para este trimestre, devolver el trimestre con los registros, de lo contrario, devolver null
      return registrosTrimestre.length > 0
        ? {label: trimestre.trimestreId, entries: registrosTrimestre}
        : null
    })
    .filter(trimestre => trimestre !== null) // Eliminar trimestres sin registros

  return agrupado
}
// Función para obtener todos los trimestres posibles dentro del rango de fechas de los datos disponibles
function obtenerTrimestres(arreglo: any[]) {
  const trimestres = []
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  // Obtener la fecha mínima y máxima de los registros
  const fechas = arreglo.map((item: any) => new Date(item.date_created))
  // @ts-ignore
  const fechaMinima = new Date(Math.min.apply(null, fechas))
  // @ts-ignore
  const fechaMaxima = new Date(Math.max.apply(null, fechas))

  // Obtener el año y trimestre de la fecha mínima
  let year = fechaMinima.getFullYear()
  let trimestre = Math.floor(fechaMinima.getMonth() / 3)

  // Iterar sobre las fechas hasta alcanzar o superar la fecha máxima
  while (new Date(year, trimestre * 3) <= fechaMaxima) {
    // Calcular la fecha de inicio y final del trimestre
    const startDate = new Date(year, trimestre * 3)
    const endDate = new Date(year, (trimestre + 1) * 3, 0)

    // Agregar el trimestre al arreglo
    const trimestreObj = {
      trimestreId: `${year.toString().slice(-2)}-Q${trimestre + 1}`,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      label: `${meses[startDate.getMonth()]} ${startDate.getFullYear()} - ${
        meses[endDate.getMonth()]
      } ${endDate.getFullYear()}`,
      entries: [],
    }
    trimestres.push(trimestreObj)

    // Avanzar al siguiente trimestre
    if (trimestre === 3) {
      year++
      trimestre = 0
    } else {
      trimestre++
    }
  }

  return trimestres
}

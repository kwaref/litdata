// MONTHLY
export function agruparPorMes(arreglo: any[]) {
  // Obtener todos los meses posibles dentro del rango de fechas de los datos disponibles
  const meses = obtenerMeses(arreglo)

  // Agrupar los registros por mes
  const agrupado = meses
    .map((mes: any) => {
      // Filtrar los registros que pertenecen al mes actual
      const registrosMes = arreglo.filter((item: any) => {
        const fechaItem = new Date(item.date_created)
        return fechaItem >= mes.startDate && fechaItem <= mes.endDate
      })

      // Si hay registros para este mes, devolver el mes con los registros, de lo contrario, devolver null
      return registrosMes.length > 0 ? {label: mes.label, entries: registrosMes} : null
    })
    .filter(mes => mes !== null) // Eliminar meses sin registros

  return agrupado
}
// Función para obtener todos los meses posibles dentro del rango de fechas de los datos disponibles
function obtenerMeses(arreglo: any[]) {
  const meses = []
  const nombresMeses = [
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
  const fechas = arreglo.map(item => new Date(item.date_created))
  // @ts-ignore
  const fechaMinima = new Date(Math.min.apply(null, fechas))
  // @ts-ignore
  const fechaMaxima = new Date(Math.max.apply(null, fechas))

  // Obtener el año y mes de la fecha mínima
  let year = fechaMinima.getFullYear()
  let month = fechaMinima.getMonth()

  // Iterar sobre las fechas hasta alcanzar o superar la fecha máxima
  while (new Date(year, month) <= fechaMaxima) {
    // Calcular la fecha de inicio y final del mes
    const startDate = new Date(year, month)
    const endDate = new Date(year, month + 1, 0)

    // Agregar el mes al arreglo
    const mes = {
      mesId: `${year}-${month < 9 ? '0' : ''}${month + 1}`,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      // label: `${nombresMeses[startDate.getMonth()]} ${startDate.getFullYear()}`,
      label: `${startDate.getMonth() + 1}/${startDate.getFullYear().toString().slice(-2)}`,
      entries: [],
    }
    meses.push(mes)

    // Avanzar al siguiente mes
    if (month === 11) {
      year++
      month = 0
    } else {
      month++
    }
  }

  return meses
}

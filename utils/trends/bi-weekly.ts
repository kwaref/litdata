// BI-WEEKLY
export function agruparPorDosSemanas(arreglo: any[]) {
  // Obtener todas las quincenas posibles dentro del rango de fechas de los datos disponibles
  const quincenas = obtenerQuincenas(arreglo)

  // Agrupar los registros por quincena
  const agrupado = quincenas
    .map(quincena => {
      // Filtrar los registros que pertenecen a la quincena actual
      const registrosQuincena = arreglo.filter((item: any) => {
        const fechaItem = new Date(item.date_created)
        return fechaItem >= quincena.startDate && fechaItem <= quincena.endDate
      })

      // Si hay registros para esta quincena, devolver la quincena con los registros, de lo contrario, devolver null
      return registrosQuincena.length > 0
        ? {label: quincena.label, entries: registrosQuincena}
        : null
    })
    .filter(quincena => quincena !== null) // Eliminar quincenas sin registros

  return agrupado
}

// Función para obtener todas las quincenas posibles dentro del rango de fechas de los datos disponibles
function obtenerQuincenas(arreglo: any[]) {
  const quincenas = []

  // Obtener la fecha mínima y máxima de los registros
  const fechas = arreglo.map((item: any) => new Date(item.date_created))
  // @ts-ignore
  const fechaMinima = new Date(Math.min.apply(null, fechas))
  // @ts-ignore
  const fechaMaxima = new Date(Math.max.apply(null, fechas))

  // Obtener el año de la fecha mínima
  const year = fechaMinima.getFullYear()

  // Obtener la primera fecha de inicio de una quincena (lunes de una semana par)
  let startDate = new Date(year, 0, 1) // Iniciar desde el primer día del año
  startDate.setDate(startDate.getDate() + ((1 + 7 - startDate.getDay()) % 7)) // Ajustar al próximo lunes
  if (startDate.getDate() > 7) {
    startDate.setDate(startDate.getDate() + 7) // Si ya pasó el lunes de la primera semana, avanzar una semana más
  }

  // Iterar sobre las fechas hasta alcanzar o superar la fecha máxima
  while (startDate < fechaMaxima) {
    // Calcular la fecha final de la quincena (domingo de la semana continua)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 13) // 13 días después (una quincena)

    // Agregar la quincena al arreglo
    const quincena = {
      // label: startDate.toLocaleDateString() + ' - ' + endDate.toLocaleDateString(),
      label: startDate.toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
      }),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      entries: [],
    }
    quincenas.push(quincena)

    // Avanzar a la siguiente quincena (lunes de la semana siguiente)
    startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() + 1)
  }

  return quincenas
}

// DAILY
export function agruparPorDia(arreglo: any[]) {
  // Obtener todos los días posibles dentro del rango de fechas de los datos disponibles
  const dias = obtenerDias(arreglo)

  // Agrupar los registros por día
  const agrupado = dias
    .map(dia => {
      // Filtrar los registros que pertenecen al día actual
      const registrosDia = arreglo.filter(item => {
        const fechaItem = new Date(item.date_created)
        return fechaItem >= dia.startDate && fechaItem <= dia.endDate
      })

      // Si hay registros para este día, devolver el día con los registros, de lo contrario, devolver null
      return registrosDia.length > 0 ? {label: dia.label, entries: registrosDia} : null
    })
    .filter(dia => dia !== null) // Eliminar días sin registros

  return agrupado
}
// Función para obtener todos los días posibles dentro del rango de fechas de los datos disponibles
function obtenerDias(arreglo: any[]) {
  const dias = []

  // Obtener la fecha mínima y máxima de los registros
  const fechas = arreglo.map((item: any) => new Date(item.date_created))
  // @ts-ignore
  const fechaMinima = new Date(Math.min.apply(null, fechas))
  // @ts-ignore
  const fechaMaxima = new Date(Math.max.apply(null, fechas))

  // Obtener el año, mes y día de la fecha mínima
  let year = fechaMinima.getFullYear()
  let month = fechaMinima.getMonth()
  let day = fechaMinima.getDate()

  // Iterar sobre las fechas hasta alcanzar o superar la fecha máxima
  while (new Date(year, month, day) <= fechaMaxima) {
    // Calcular la fecha de inicio y final del día
    const startDate = new Date(year, month, day)
    const endDate = new Date(year, month, day, 23, 59, 59)

    // Agregar el día al arreglo
    const dia = {
      diaId: `${year}-${month < 9 ? '0' : ''}${month + 1}-${day < 10 ? '0' : ''}${day}`,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      label: `${month + 1}/${day}/${year.toString().slice(-2)}`,
      entries: [],
    }
    dias.push(dia)

    // Avanzar al siguiente día
    if (day === new Date(year, month + 1, 0).getDate()) {
      if (month === 11) {
        year++
        month = 0
        day = 1
      } else {
        month++
        day = 1
      }
    } else {
      day++
    }
  }

  return dias
}

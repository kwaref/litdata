export function exportJson(data: any) {
  // Convierte los datos a una cadena JSON
  const jsonStr = JSON.stringify(data, null, 2)

  // Crea un objeto Blob con los datos
  const jsonBlob = new Blob([jsonStr], {type: 'application/json'})

  // Crea una URL para el objeto Blob
  const url = URL.createObjectURL(jsonBlob)

  // Crea un enlace y haz clic en él para descargar el archivo
  const link = document.createElement('a')
  link.href = url
  link.download = 'data.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

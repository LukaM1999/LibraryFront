const convertBase64ToBlob = async (base64Image: string): Promise<Blob> => {
  const base64Response = await fetch(`data:image/png;base64,${base64Image}`)
  const blob = await base64Response.blob()
  return blob
}

export default convertBase64ToBlob

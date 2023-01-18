const readFileAsync = (file) => {
  //! This only works on UI side, re-write for server side
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  })
}

export async function processFile(file) {
  try {
    let contentBuffer = await readFileAsync(file);
    return contentBuffer
  } catch (err) {
    console.log(err);
  }
}


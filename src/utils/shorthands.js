import Swal from 'sweetalert2'

export const swal = (t, status="success", txt="", extraText="") => {
  Swal.fire({
    title: t(`${txt}.title`),
    text: t(`${txt}.text`) + `${extraText}`,
    icon: status,
    customClass: "font-mono",
  })
}


const readFileAsync = (file) => {
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


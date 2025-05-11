export const sleep = (time = 0) => new Promise((resolve) => setTimeout(resolve, Math.ceil(time)))

export const convertFileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
})
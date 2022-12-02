export async function getAllData() {
    const response = await fetch('/read/5xDf6M5NRDDKGXAysr3ZRBfrW8vybtFocKP70JuuA3Y');
    return await response.json();
}
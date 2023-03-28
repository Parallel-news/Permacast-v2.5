import redstone from 'redstone-api';

export async function fetchARPriceInUSD(): Promise<number> {
  return (await redstone.getPrice("AR"))?.value;
}

export async function fetchAR24HrChange() {
  const msInDay = 86400000
  const price = await redstone.getHistoricalPrice("AR", {
    date: Date.now() - msInDay, // Timestamp in MS
  });
  return price?.value
}

export async function calculateAR24HrDifference() {
  const dayBeforePrice = await fetchAR24HrChange()
  const currentPrice = await fetchARPriceInUSD()
  return investmentPercentageGain(dayBeforePrice, currentPrice)
}

export function investmentPercentageGain(oldPrice: number, newPrice: number) {
  return ((newPrice - oldPrice) / oldPrice) * 100
}
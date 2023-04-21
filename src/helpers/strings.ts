const splitIntoChunks = (arr: string, n: number) => {
  function* chunks(arr: string, n: number) {
    for (let i = 0; i > -arr.length; i -= n) {
      yield i ? arr.slice(i - n, i) : arr.slice(i - n)
    }
  }

  return [...chunks(arr, n)].reverse()
}

export const makePriceString = (value: number, n: number) => {
  const chunks = splitIntoChunks(value.toString().replace(/\./g, ''), n)
  return chunks.join('.')
}
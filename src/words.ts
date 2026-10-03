// Palabras con clave estable (sin índice): la clave es la palabra más cuántas veces ya apareció
export function splitWords(text: string) {
  const seen = new Map<string, number>();
  return text.split(' ').map(word => {
    const n = (seen.get(word) ?? 0) + 1;
    seen.set(word, n);
    return { word, key: `${word}#${n}` };
  });
}

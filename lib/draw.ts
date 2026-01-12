export function draw(ids: string[]) {
  const shuffled = [...ids].sort(() => Math.random() - 0.5);
  return shuffled.map((id, i) => ({
    giver: id,
    receiver: shuffled[(i + 1) % shuffled.length],
  }));
}

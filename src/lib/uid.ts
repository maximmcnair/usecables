export default function uid(): string {
  let a = ('000' + (Math.random() * 46656 || 0).toString(36)).slice(-3);
  let b = ('000' + (Math.random() * 46656 || 0).toString(36)).slice(-3);
  return 'z' + a + b;
}

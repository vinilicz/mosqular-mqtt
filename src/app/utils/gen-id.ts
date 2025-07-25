export function genId() {
  const uuid = crypto.randomUUID().split('-');
  return uuid[0] + uuid[4];
}

export function genClientId() {
  return 'mosqular_' + crypto.randomUUID().split('-')[0];
}

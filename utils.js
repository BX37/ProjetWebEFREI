// utils.js
function parseHM(hm) {
  const [h, m] = hm.split(':').map(Number);
  let total = h * 60 + m;
  if (h < 5) total += 24 * 60;
  return total;
}

function toHM(d) {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d);
}

function computeNextArrival(now = new Date(), headwayMin = 3) {
  // Vérifie si headwayMin est invalide
  if (headwayMin <= 0) {
    return { service: 'closed', error: 'headway invalide', tz: 'Europe/Paris' };
  }

  const minutes = now.getHours() * 60 + now.getMinutes();
  let currMinutes = minutes;
  if (now.getHours() < 5) currMinutes += 24 * 60; // après minuit
  const startMinutes = 5 * 60 + 30; // 05:30
  const endMinutes = parseHM('01:15');
  if (currMinutes < startMinutes || currMinutes > endMinutes) {
    return { service: 'closed', tz: 'Europe/Paris' };
  }
  const minutesSinceStart = currMinutes - startMinutes;
  const intervals = Math.ceil(minutesSinceStart / headwayMin);
  const nextMinutesFromStart = intervals * headwayMin;
  let nextTotalMinutes = startMinutes + nextMinutesFromStart;
  const nextHour = Math.floor((nextTotalMinutes % (24 * 60)) / 60);
  const nextMinute = nextTotalMinutes % 60;
  const nextDate = new Date(now);
  nextDate.setHours(nextHour, nextMinute, 0, 0);
  const lastStartMinutes = parseHM('00:45');
  const isLast = (currMinutes >= lastStartMinutes && currMinutes <= endMinutes);
  return {
    nextArrival: toHM(nextDate),
    isLast,
    headwayMin,
    tz: 'Europe/Paris'
  };
}

module.exports = { computeNextArrival, toHM, parseHM };

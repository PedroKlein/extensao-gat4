/**
 * Helpers de data para cálculos gestacionais.
 */

/** Calcula dias entre duas datas (ISO strings ou Date) */
export function daysBetween(from: string | Date, to: string | Date): number {
  const d1 = typeof from === 'string' ? new Date(from) : from;
  const d2 = typeof to === 'string' ? new Date(to) : to;
  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/** Calcula dias desde uma data até hoje */
export function daysSince(date: string | Date): number {
  return daysBetween(date, new Date());
}

/** Calcula idade gestacional em semanas a partir da DUM */
export function calculateIG(dum: string | Date): number {
  const days = daysSince(dum);
  return Math.floor(days / 7);
}

/** Retorna o trimestre gestacional dado a IG em semanas */
export function getTrimester(igWeeks: number): 1 | 2 | 3 {
  if (igWeeks <= 13) return 1;
  if (igWeeks <= 27) return 2;
  return 3;
}

/** Calcula DPP a partir da DUM (DUM + 280 dias) */
export function calculateDPP(dum: string): string {
  const d = new Date(dum);
  d.setDate(d.getDate() + 280);
  return d.toISOString().split('T')[0];
}

/** Calcula idade em anos a partir da data de nascimento */
export function calculateAge(dataNascimento: string): number {
  const birth = new Date(dataNascimento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/** Calcula distância em metros entre dois pontos (Haversine) */
export function distanceMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

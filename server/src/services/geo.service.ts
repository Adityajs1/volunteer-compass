import prisma from '../config/db';

// ─── Haversine Distance (km) ──────────────────────────────────
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Find events within radius ────────────────────────────────
export const findNearbyEvents = async (
  lat: number,
  lng: number,
  radiusKm = 20,
  limit = 50
) => {
  // Approximate bounding box (rough filter before exact Haversine)
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const candidates = await prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      latitude:  { gte: lat - latDelta,  lte: lat + latDelta  },
      longitude: { gte: lng - lngDelta,  lte: lng + lngDelta  },
    },
    include: {
      organizer: { select: { id: true, name: true, avatarUrl: true } },
      categories: { include: { category: true } },
      skills:     { include: { skill: true } },
      _count:     { select: { rsvps: true } },
    },
    take: limit * 3, // over-fetch so we have enough after exact filter
  });

  // Exact Haversine filter + sort by distance
  const withDistance = candidates
    .filter(e => e.latitude !== null && e.longitude !== null)
    .map(e => ({
      ...e,
      distanceKm: haversineKm(lat, lng, e.latitude!, e.longitude!),
    }))
    .filter(e => e.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);

  return { events: withDistance, total: withDistance.length };
};

// ─── Geocode a city name to lat/lng (simple lookup table) ─────
// For a production app you'd call a real geocoding API here.
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'new delhi':  { lat: 28.6139, lng: 77.2090 },
  'delhi':      { lat: 28.6139, lng: 77.2090 },
  'mumbai':     { lat: 19.0760, lng: 72.8777 },
  'bangalore':  { lat: 12.9716, lng: 77.5946 },
  'bengaluru':  { lat: 12.9716, lng: 77.5946 },
  'hyderabad':  { lat: 17.3850, lng: 78.4867 },
  'chennai':    { lat: 13.0827, lng: 80.2707 },
  'kolkata':    { lat: 22.5726, lng: 88.3639 },
  'pune':       { lat: 18.5204, lng: 73.8567 },
  'ahmedabad':  { lat: 23.0225, lng: 72.5714 },
  'jaipur':     { lat: 26.9124, lng: 75.7873 },
};

export const geocodeCity = (city: string): { lat: number; lng: number } | null => {
  return CITY_COORDS[city.toLowerCase()] ?? null;
};

export { haversineKm };

const EARTH_RADIUS_KM = 6371

export const toRadians = (degrees) => (degrees * Math.PI) / 180

export const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

export const calculateSpeedKmh = (prevPoint, currentPoint) => {
  if (!prevPoint || !currentPoint) return 0
  const distanceKm = haversineDistanceKm(
    prevPoint.latitude,
    prevPoint.longitude,
    currentPoint.latitude,
    currentPoint.longitude,
  )
  const timeHours = (currentPoint.timestamp - prevPoint.timestamp) / 3600
  if (timeHours <= 0) return 0
  return distanceKm / timeHours
}

import axios from 'axios'

const issEndpoints = [
  'https://api.open-notify.org/iss-now.json',
  'https://api.allorigins.win/raw?url=http://api.open-notify.org/iss-now.json',
]

const astroEndpoints = [
  'https://api.open-notify.org/astros.json',
  'https://api.allorigins.win/raw?url=http://api.open-notify.org/astros.json',
]

async function fetchFromFallback(endpoints) {
  for (const endpoint of endpoints) {
    try {
      const { data } = await axios.get(endpoint, { timeout: 12000 })
      return data
    } catch {
      // continue trying fallback URLs
    }
  }
  throw new Error('All ISS endpoints failed')
}

export const fetchISSLocation = async () => {
  const data = await fetchFromFallback(issEndpoints)
  const position = data?.iss_position
  if (!position) throw new Error('Invalid ISS location payload')
  return {
    latitude: Number(position.latitude),
    longitude: Number(position.longitude),
    timestamp: Number(data.timestamp ?? Math.floor(Date.now() / 1000)),
  }
}

export const fetchAstronauts = async () => {
  const data = await fetchFromFallback(astroEndpoints)
  return {
    count: data.number ?? 0,
    people: (data.people ?? []).filter((person) => person.craft === 'ISS'),
  }
}

export const reverseLookupLocation = async (latitude, longitude) => {
  try {
    const { data } = await axios.get(
      'https://api.bigdatacloud.net/data/reverse-geocode-client',
      {
        params: {
          latitude,
          longitude,
          localityLanguage: 'en',
        },
        timeout: 10000,
      },
    )
    return (
      data.locality ||
      data.city ||
      data.principalSubdivision ||
      data.countryName ||
      data.localityInfo?.informative?.[0]?.name ||
      'Over open ocean'
    )
  } catch {
    return 'Over open ocean'
  }
}

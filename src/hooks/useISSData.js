import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { calculateSpeedKmh } from '../utils/haversine'
import { fetchAstronauts, fetchISSLocation, reverseLookupLocation } from '../services/issService'

const POLL_INTERVAL = 15000

export const useISSData = () => {
  const [positions, setPositions] = useState([])
  const [speedHistory, setSpeedHistory] = useState([])
  const [astronauts, setAstronauts] = useState({ count: 0, people: [] })
  const [nearestPlace, setNearestPlace] = useState('Loading...')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const updateLocation = useCallback(async (showToast = false) => {
    try {
      setError('')
      const point = await fetchISSLocation()
      setPositions((prev) => {
        const next = [...prev, point].slice(-15)
        const previousPoint = prev[prev.length - 1]
        const speed = calculateSpeedKmh(previousPoint, point)
        if (speed > 0) {
          setSpeedHistory((history) =>
            [...history, { timestamp: point.timestamp, speed: Number(speed.toFixed(2)) }].slice(-30),
          )
        }
        return next
      })
      const place = await reverseLookupLocation(point.latitude, point.longitude)
      setNearestPlace(place)
      if (showToast) toast.success('ISS location refreshed')
    } catch (err) {
      setError(err.message || 'Failed to update ISS location')
      if (showToast) toast.error('Unable to refresh ISS data')
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshAstronauts = useCallback(async () => {
    try {
      const data = await fetchAstronauts()
      setAstronauts(data)
    } catch (err) {
      setError(err.message || 'Failed to load astronauts')
    }
  }, [])

  useEffect(() => {
    const initialLoad = setTimeout(() => {
      void updateLocation()
      void refreshAstronauts()
    }, 0)
    const timer = setInterval(updateLocation, POLL_INTERVAL)
    return () => {
      clearTimeout(initialLoad)
      clearInterval(timer)
    }
  }, [refreshAstronauts, updateLocation])

  const latestPosition = useMemo(() => positions[positions.length - 1], [positions])
  const latestSpeed = speedHistory[speedHistory.length - 1]?.speed || 0

  return {
    positions,
    latestPosition,
    speedHistory,
    latestSpeed,
    astronauts,
    nearestPlace,
    loading,
    error,
    refreshISS: () => updateLocation(true),
    refreshAstronauts,
  }
}

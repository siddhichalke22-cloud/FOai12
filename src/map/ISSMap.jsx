import { motion } from 'framer-motion'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const issIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3212/3212608.png',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
})

export const ISSMap = ({ positions }) => {
  const path = positions.map((p) => [p.latitude, p.longitude])
  const latest = positions[positions.length - 1]

  return (
    <motion.div
      className="glass-card h-[360px] overflow-hidden p-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {latest ? (
        <MapContainer
          center={[latest.latitude, latest.longitude]}
          zoom={3}
          scrollWheelZoom
          className="h-full w-full rounded-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latest.latitude, latest.longitude]} icon={issIcon}>
            <Tooltip>ISS current location</Tooltip>
          </Marker>
          <Polyline positions={path} color="#38bdf8" weight={3} />
        </MapContainer>
      ) : (
        <div className="flex h-full items-center justify-center">Waiting for ISS coordinates...</div>
      )}
    </motion.div>
  )
}

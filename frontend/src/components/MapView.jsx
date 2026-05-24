import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet'


import L from 'leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'

import markerIcon from 'leaflet/dist/images/marker-icon.png'

import markerShadow from 'leaflet/dist/images/marker-shadow.png'


delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})


import 'leaflet/dist/leaflet.css'


const MapView = () => {

  return (

    <MapContainer
      center={[13.4549, -16.5790]}
      zoom={10}
      style={{
        height: '500px',
        width: '100%',
        borderRadius: '20px'
      }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      <Marker position={[13.4549, -16.5790]}>

        <Popup>
          Banjul
        </Popup>

      </Marker>

    </MapContainer>
  )
}

export default MapView
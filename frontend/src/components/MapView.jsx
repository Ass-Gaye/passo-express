import { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import io from 'socket.io-client';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const initialVehicles = [
  {
    id: 'vehicle-1',
    name: 'Route 1',
    status: 'Live',
    position: [13.4549, -16.5790],
    description: 'Banjul ↔ Serekunda',
  },
  {
    id: 'vehicle-2',
    name: 'Route 2',
    status: 'Live',
    position: [13.4591, -16.6789],
    description: 'Brikama ↔ Kanifing',
  },
  {
    id: 'vehicle-3',
    name: 'Route 3',
    status: 'Live',
    position: [13.4829, -16.6313],
    description: 'Bakau ↔ Kotu',
  },
];

const getVehicleIcon = (status) => {
  const color = status === 'Live' ? '#2563eb' : '#16a34a';
  return L.divIcon({
    html: `<div style="background:${color};width:14px;height:14px;border-radius:9999px;border:2px solid white;box-shadow:0 0 6px rgba(0,0,0,0.25);"></div>`,
    className: '',
    iconSize: [14, 14],
  });
};

const MapView = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
    });

    const interval = window.setInterval(() => {
      setVehicles((prev) =>
        prev.map((vehicle, index) => {
          const driftLat = index % 2 === 0 ? 0.0012 : -0.0012;
          const driftLng = index === 1 ? -0.0014 : 0.0014;
          return {
            ...vehicle,
            position: [
              Math.min(13.7, Math.max(13.1, vehicle.position[0] + driftLat)),
              Math.min(-15.9, Math.max(-16.8, vehicle.position[1] + driftLng)),
            ],
          };
        })
      );
    }, 2500);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('vehicle-location', (data) => {
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === `vehicle-${data.vehicleId}`
            ? {
                ...vehicle,
                position: [data.latitude, data.longitude],
                status: 'Live',
              }
            : vehicle
        )
      );
    });

    return () => {
      window.clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  const activeCount = useMemo(() => vehicles.filter((vehicle) => vehicle.status === 'Live').length, [vehicles]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <span>{connected ? 'Live vehicle feed connected' : 'Simulating live updates'}</span>
        <span>{activeCount} active vehicles</span>
      </div>

      <MapContainer
        center={[13.4549, -16.5790]}
        zoom={10}
        style={{
          height: '500px',
          width: '100%',
          borderRadius: '20px',
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {vehicles.map((vehicle) => (
          <Marker key={vehicle.id} position={vehicle.position} icon={getVehicleIcon(vehicle.status)}>
            <Popup>
              <div>
                <p className="font-semibold">{vehicle.name}</p>
                <p className="text-sm text-gray-600">{vehicle.description}</p>
                <p className="mt-1 text-xs text-blue-600">Status: {vehicle.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
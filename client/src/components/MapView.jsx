import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createIcon = (color, emoji) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;box-shadow:0 3px 8px rgba(0,0,0,0.3)">${emoji}</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const icons = {
  flood: createIcon('#3b82f6', '🌊'), fire: createIcon('#ef4444', '🔥'),
  earthquake: createIcon('#8b5cf6', '🌍'), cyclone: createIcon('#06b6d4', '🌀'),
  landslide: createIcon('#a855f7', '⛰️'), 'building collapse': createIcon('#f97316', '🏚️'),
  'road accident': createIcon('#6366f1', '🚗'), shelter: createIcon('#16a34a', '🏠'),
  other: createIcon('#6b7280', '⚠️'),
};

const MapView = ({ disasters = [], shelters = [], center = [20.5937, 78.9629], zoom = 5, height = '400px', onMarkerClick }) => {
  return (
    <div style={{ height }} className="rounded-xl overflow-hidden shadow-card">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {disasters.map((d) => {
          const lat = d.latitude || d.location?.lat;
          const lng = d.longitude || d.location?.lng;
          if (!lat || !lng) return null;
          const icon = icons[d.type?.toLowerCase()] || icons.other;
          return (
            <Marker key={d.id || d._id} position={[lat, lng]} icon={icon}
              eventHandlers={{ click: () => onMarkerClick && onMarkerClick(d) }}>
              <Popup>
                <div className="p-1 min-w-[180px]">
                  <h3 className="font-semibold text-gray-800 text-sm">{d.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{d.type} | {d.severity}</p>
                  <p className="text-xs text-gray-400 mt-1">{d.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
        {shelters.map((s) => {
          const lat = s.location?.lat;
          const lng = s.location?.lng;
          if (!lat || !lng) return null;
          return (
            <Marker key={s.id || s._id} position={[lat, lng]} icon={icons.shelter}
              eventHandlers={{ click: () => onMarkerClick && onMarkerClick(s) }}>
              <Popup>
                <div className="p-1 min-w-[180px]">
                  <h3 className="font-semibold text-gray-800 text-sm">{s.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Capacity: {s.availableBeds}/{s.capacity}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.location?.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;

'use client';
import { useEffect, useRef, useState } from 'react';

interface Destination {
  id: number;
  name: string;
  lat: number;
  lng: number;
  tourists: number;
  trend: string;
  density: string;
  type: string;
  rating?: number;
}

interface MapProps {
  destinations: Destination[];
  selected: Destination | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect: (d: any) => void;
}

export default function Map({ destinations, selected, onSelect }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mapInstanceRef.current) return; // already initialized

    // Dynamically import leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      if (!mapRef.current) return;

      // Initialize map
      const map = L.default.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Dark tile layer
      L.default.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      // Default icon fix
      const defaultIcon = L.default.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Add markers
      destinations.forEach((dest) => {
        const marker = L.default.marker([dest.lat, dest.lng], { icon: defaultIcon });
        marker.bindPopup(`
          <div style="background:#1A1A1A;color:#E5E5E5;padding:10px;border-radius:8px;min-width:160px;border:1px solid rgba(255,255,255,0.1)">
            <strong style="font-size:13px">${dest.name}</strong>
            <div style="color:#888;font-size:11px;margin-top:4px">Type: ${dest.type}</div>
            <div style="color:#888;font-size:11px">Visitors: ${dest.tourists.toLocaleString()}</div>
            <div style="color:#4ade80;font-size:11px;font-weight:600">Trend: ${dest.trend}</div>
          </div>
        `);
        marker.on('click', () => onSelect(dest));
        marker.addTo(map);
        markersRef.current.push(marker);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, []); // Only run once

  return (
    <div
      ref={mapRef}
      style={{ height: '100%', width: '100%', background: '#0D0D0D' }}
    />
  );
}

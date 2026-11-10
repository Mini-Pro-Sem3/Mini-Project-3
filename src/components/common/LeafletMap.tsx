import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Complaint, ComplaintStatus } from '../../types';

interface LeafletMapProps {
  complaints?: Complaint[];
  selectedComplaintId?: string | null;
  onSelectComplaint?: (complaintId: string) => void;
  // Picker mode props
  isPickerMode?: boolean;
  pickedLocation?: { lat: number; lng: number };
  onLocationChange?: (lat: number, lng: number) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

const STATUS_COLORS: Record<ComplaintStatus, { bg: string; border: string }> = {
  Submitted: { bg: '#C77B59', border: '#9C5838' }, // Muted Terracotta
  Assigned: { bg: '#687447', border: '#424D2B' }, // Olive Green
  'In Progress': { bg: '#3F6212', border: '#1A2E05' }, // Deep Olive
  Resolved: { bg: '#15803D', border: '#166534' }, // Forest / Sage
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  complaints = [],
  onSelectComplaint,
  isPickerMode = false,
  pickedLocation,
  onLocationChange,
  center = [37.7749, -122.4194],
  zoom = 13,
  height = '420px',
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: pickedLocation ? [pickedLocation.lat, pickedLocation.lng] : center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // In picker mode, listen for map clicks
    if (isPickerMode && onLocationChange) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update complaints markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || isPickerMode) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (complaints.length === 0) return;

    const bounds = L.latLngBounds([]);

    complaints.forEach((c) => {
      const { lat, lng } = c.location;
      bounds.extend([lat, lng]);

      const colors = STATUS_COLORS[c.status] || { bg: '#687447', border: '#424D2B' };

      const markerHtml = `
        <div style="
          background-color: ${colors.bg};
          border: 2px solid #FFFFFF;
          box-shadow: 0 4px 8px rgba(0,0,0,0.25);
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: #FFFFFF;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-civic-pin',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: inherit; max-width: 240px; color: #292D25;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #687447; letter-spacing: 0.05em;">${c.id}</span>
            <span style="font-size: 11px; font-weight: 600; color: ${colors.bg}; background: #F6F5EC; padding: 2px 6px; border-radius: 4px;">${c.status}</span>
          </div>
          <div style="margin-bottom: 6px; border-radius: 6px; overflow: hidden; height: 90px; background: #E6E5DA;">
            <img src="${c.images[0] || ''}" alt="Garbage" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px; line-height: 1.3;">${c.title}</div>
          <div style="font-size: 11px; color: #71717A; margin-bottom: 8px;">${c.location.address}</div>
          <button id="view-complaint-${c.id}" style="
            width: 100%;
            padding: 6px 10px;
            background-color: #687447;
            color: #FFFFFF;
            border: none;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
          ">View Details →</button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-complaint-${c.id}`);
        if (btn && onSelectComplaint) {
          btn.onclick = () => {
            onSelectComplaint(c.id);
          };
        }
      });

      markersRef.current.push(marker);
    });

    if (bounds.isValid() && complaints.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [complaints, isPickerMode]);

  // Handle Location Picker pin
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isPickerMode || !pickedLocation) return;

    if (pickerMarkerRef.current) {
      pickerMarkerRef.current.setLatLng([pickedLocation.lat, pickedLocation.lng]);
    } else {
      const pickerIcon = L.divIcon({
        className: 'custom-picker-pin',
        html: `
          <div style="
            background-color: #C77B59;
            border: 3px solid #FFFFFF;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: bounce 1s infinite alternate;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background: #FFFFFF;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([pickedLocation.lat, pickedLocation.lng], {
        icon: pickerIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (event) => {
        const markerPos = event.target.getLatLng();
        if (onLocationChange) {
          onLocationChange(markerPos.lat, markerPos.lng);
        }
      });

      pickerMarkerRef.current = marker;
    }

    map.panTo([pickedLocation.lat, pickedLocation.lng], { animate: true });
  }, [pickedLocation, isPickerMode]);

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-[#E6E5DA] shadow-xs ${className}`}>
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Map Legend Overlay if complaints are showing */}
      {!isPickerMode && complaints.length > 0 && (
        <div className="absolute bottom-3 right-3 z-[400] bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-[#E6E5DA] shadow-xs text-xs space-y-1">
          <div className="font-semibold text-[#292D25] mb-1">Status Legend</div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C77B59]"></span>
            <span>Submitted ({complaints.filter((c) => c.status === 'Submitted').length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#687447]"></span>
            <span>Assigned ({complaints.filter((c) => c.status === 'Assigned').length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3F6212]"></span>
            <span>In Progress ({complaints.filter((c) => c.status === 'In Progress').length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]"></span>
            <span>Resolved ({complaints.filter((c) => c.status === 'Resolved').length})</span>
          </div>
        </div>
      )}
    </div>
  );
};

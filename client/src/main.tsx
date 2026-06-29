import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

import './index.css';
import 'leaflet/dist/leaflet.css';

function App() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);

  type MenuState = 'closed' | 'main' | 'createRoute' | 'account' | 'savedRoutes';
  const [menuState, setMenuState] = useState<MenuState>('closed');

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([38, -106], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance.current);

    mapInstance.current.locate({
      watch: true,
      setView: true,
      maxZoom: 12,
      enableHighAccuracy: true,
    });

    mapInstance.current.on('locationfound', (e) => {
      if (!mapInstance.current) return;

      if (!userMarker.current) {
        userMarker.current = L.marker(e.latlng)
          .addTo(mapInstance.current)
          .bindTooltip('You are here');
      } else {
        userMarker.current.setLatLng(e.latlng);
      }
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div id="app">
      {/* Hamburger button */}
      <img
        src="HamburgerMenuImage.png"
        id="HamburgerMenuImage"
        onClick={() => setMenuState((prev) => prev === 'main' ? 'closed' : 'main')}
      />

      {menuState === 'main' && (
        <div id="HamburgerMenu">
          <button>Account</button>

          <button onClick={() => setMenuState('createRoute')}>
            Create Route
          </button>

          <button>Saved Routes</button>
        </div>
      )}

      {menuState === 'createRoute' && (
        <div id="HamburgerMenu">
          <button onClick={() => setMenuState('main')}>Back</button>
          <button>Add Waypoint</button>
          <button>Finish Route</button>
          <div id="RouteCreationPreview">
            <div>
              <img src="/marker.svg"></img>
              <p>Waypoint X</p>
              <button>Set</button>{/* Click this then click the map to change this waypoints location*/}
              <button>Up</button>
              <button>Dn</button>
              <button>X</button>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} id="map" />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
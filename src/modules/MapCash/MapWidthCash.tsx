import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { getTile, saveTile } from '../../tileCache';

type Props = {
    center: [number, number];
    zoom: number;
    tileUrlTemplate: string;
};

const CachedTileLayer = L.TileLayer.extend({
    createTile: function (coords: any, done: any) {
        const tile = document.createElement('img');
        const z = coords.z;
        const x = coords.x;
        const y = coords.y;
        const key = `${z}/${x}/${y}`;

        tile.alt = '';
        tile.setAttribute('role', 'presentation');

        tile.width = this.getTileSize().x;
        tile.height = this.getTileSize().y;

        tile.onload = () => done(null, tile);
        tile.onerror = () => done(new Error('Tile load error'), tile);

        getTile(key)
            .then(blob => {
                if (blob) {
                    tile.src = URL.createObjectURL(blob);
                } else {
                    const url = this.getTileUrl(coords);
                    fetch(url)
                        .then(res => {
                            if (!res.ok) throw new Error('Failed to fetch tile');
                            return res.blob();
                        })
                        .then(blob => {
                            saveTile(key, blob).catch(() =>
                                console.warn('Failed to save tile in cache')
                            );
                            tile.src = URL.createObjectURL(blob);
                        })
                        .catch(() => {
                            tile.src = this.getTileUrl(coords);
                        });
                }
            })
            .catch(() => {
                tile.src = this.getTileUrl(coords);
            });

        return tile;
    },
});

export default function MapWithCache({ center, zoom, tileUrlTemplate }: Props) {
    const mapRef = useRef<L.Map | null>(null);
    const layerRef = useRef<any>(null);
    const [mapInfo, setMapInfo] = useState({
        zoom,
        lat: center[0],
        lng: center[1],
    });

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map', {
                center,
                zoom,
            });
            layerRef.current = new (CachedTileLayer as any)(tileUrlTemplate, {
                maxZoom: 19,
                tileSize: 256,
            });

            layerRef.current.addTo(mapRef.current);

            // گوش دادن به رویداد تغییر موقعیت مرکز و زوم
            mapRef.current.on('moveend zoomend', () => {
                const currentCenter = mapRef.current!.getCenter();
                setMapInfo({
                    zoom: mapRef.current!.getZoom(),
                    lat: currentCenter.lat,
                    lng: currentCenter.lng,
                });
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [center, zoom, tileUrlTemplate]);

    return (
        <>
            <section style={{ height: '600px', width: '100%', position: 'relative' }}>
                <div
                    id="map"
                    style={{ height: '600px', width: '100%' }}
                />
                {/* Label نمایش اطلاعات */}
                <div
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: 'rgba(2, 1, 1, 0.8)',
                        padding: '6px 10px',
                        borderRadius: 4,
                        fontSize: 14,
                        fontWeight: 'bold',
                        zIndex: 1000,
                        color: "white",
                        boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                    }}
                >
                    Zoom: {mapInfo.zoom.toFixed(2)} <br />
                    Lat: {mapInfo.lat.toFixed(5)} <br />
                    Lng: {mapInfo.lng.toFixed(5)}
                </div>
            </section>
        </>
    );
}

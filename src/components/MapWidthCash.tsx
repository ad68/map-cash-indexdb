

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { getTile, saveTile } from '../tileCache';

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
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [center, zoom, tileUrlTemplate]);

    return <div id="map" style={{ height: '600px', width: '800px' }} />;
}

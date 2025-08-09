import MapWithCache from './MapWidthCash'
export default function Index() {
    return <>
        <MapWithCache
            center={[35.6997, 51.337]}
            zoom={16}
            tileUrlTemplate="https://map.optimoai.ir/wmts/gm_layer/gm_grid/{z}/{x}/{y}.png"
        />
    </>
}

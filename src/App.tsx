import './App.css'
import './style/leaflet.css'
import MapWithCache from './components/MapWidthCash';
import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';
function App() {
  useEffect(() => {
    const updateServiceWorker = registerSW({
      onRegistered(r: any) {
        console.log('Service Worker registered!', r);
      },
      onRegisterError(error: any) {
        console.error('Service Worker registration failed:', error);
      },
      onNeedRefresh() {

        if (confirm('نسخه جدید آماده است. صفحه را رفرش می‌کنید؟')) {
          updateServiceWorker();
        }
      },
      onOfflineReady() {
        console.log('اپلیکیشن حالا آفلاین هم کار می‌کند.');
      },
    });
  }, [])
  return (
    <section style={{ width: "100%", height: "600px", backgroundColor: "red", margin: "auto" }}>
      <MapWithCache
        center={[35.6997, 51.337]}
        zoom={16}
        tileUrlTemplate="https://map.optimoai.ir/wmts/gm_layer/gm_grid/{z}/{x}/{y}.png"
      />
    </section>
  )
}

export default App

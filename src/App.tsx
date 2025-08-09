import './App.css'
import './style/leaflet.css'
import MapCash from './modules/MapCash';
import Home from './modules/Home';
import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { Route, Routes } from 'react-router-dom';
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
        const result = confirm('نسخه جدید آماده است. صفحه را رفرش می‌کنید؟');
        if (result) {
          updateServiceWorker()
        } else {
          console.log("کاربر لغو کرد");
        }
      },
      onOfflineReady() {
        console.log('اپلیکیشن حالا آفلاین هم کار می‌کند.');
      },
    });
  }, [])
  return (
    <section style={{ width: "100%", height: "600px", margin: "auto" }}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/map' element={<MapCash />} />
      </Routes>
    </section>
  )
}

export default App

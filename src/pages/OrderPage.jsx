import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function OrderPage() {
  const { id } = useParams();
  const [orderStatus, setOrderStatus] = useState('Preparing');

  const statuses = ['Pending', 'Preparing', 'OnTheWay', 'Delivered'];
  const statusLabels = {
    Pending: '⏳ Bekliyor',
    Preparing: '👨‍🍳 Hazırlanıyor',
    OnTheWay: '🛵 Yolda',
    Delivered: '✅ Teslim Edildi',
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sipariş Takip</h1>

      {/* Durum adımları */}
      <div style={styles.statusContainer}>
        {statuses.map((status, index) => (
          <motion.div
            key={status}
            style={{
              ...styles.statusStep,
              backgroundColor: statuses.indexOf(orderStatus) >= index ? '#ff6b35' : '#e0e0e0',
            }}
            animate={{
              scale: orderStatus === status ? 1.2 : 1,
            }}
          >
            <span style={styles.statusLabel}>{statusLabels[status]}</span>
          </motion.div>
        ))}
      </div>

      {/* Harita */}
      <div style={styles.mapContainer}>
        <MapContainer
          center={[41.0082, 28.9784]}
          zoom={13}
          style={{ height: '400px', width: '100%', borderRadius: '16px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[41.0082, 28.9784]}>
            <Popup>Kurye burada 🛵</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' },
  title: { textAlign: 'center', fontSize: '1.8rem', marginBottom: '30px' },
  statusContainer: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' },
  statusStep: { padding: '10px 20px', borderRadius: '25px', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' },
  statusLabel: { whiteSpace: 'nowrap' },
  mapContainer: { maxWidth: '800px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
};

export default OrderPage;
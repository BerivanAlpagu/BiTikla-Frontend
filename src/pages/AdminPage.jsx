import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { restaurantService, orderService, courierService } from '../services/api';

function AdminPage() {
  const [stats, setStats] = useState({ restaurants: 0, orders: 0, couriers: 0 });

  useEffect(() => {
    Promise.all([
      restaurantService.getAll(),
      orderService.getAll(),
      courierService.getAll(),
    ]).then(([restaurants, orders, couriers]) => {
      setStats({
        restaurants: restaurants.data.length,
        orders: orders.data.length,
        couriers: couriers.data.length,
      });
    });
  }, []);

  const cards = [
    { title: 'Restoranlar', value: stats.restaurants, icon: '🏪', color: '#ff6b35' },
    { title: 'Siparişler', value: stats.orders, icon: '📦', color: '#00b894' },
    { title: 'Kuryeler', value: stats.couriers, icon: '🛵', color: '#0984e3' },
  ];

  return (
    <div style={styles.container}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.title}
      >
        🎛️ Admin Paneli
      </motion.h1>

      <div style={styles.grid}>
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
            style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}
          >
            <div style={styles.cardIcon}>{card.icon}</div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ ...styles.cardValue, color: card.color }}
            >
              {card.value}
            </motion.h2>
            <p style={styles.cardTitle}>{card.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '40px 20px' },
  title: { textAlign: 'center', fontSize: '2rem', marginBottom: '40px', color: '#2d3436' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto' },
  card: { backgroundColor: 'white', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  cardIcon: { fontSize: '2.5rem', marginBottom: '15px' },
  cardValue: { fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 8px' },
  cardTitle: { color: '#636e72', margin: 0, fontSize: '1rem' },
};

export default AdminPage;
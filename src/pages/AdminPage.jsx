import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { restaurantService, orderService, courierService } from '../services/api';

function AdminPage() {
  const [stats, setStats] = useState({ restaurants: 0, orders: 0, couriers: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      restaurantService.getAll(),
      orderService.getAll(),
      courierService.getAll(),
    ]).then(([restRes, ordRes, courRes]) => {
      setStats({
        restaurants: restRes.data.length,
        orders: ordRes.data.length,
        couriers: courRes.data.length,
      });
      // Siparişleri tarihe göre yeniden eskiye sıralayalım
      const sortedOrders = ordRes.data.sort((a, b) => b.id - a.id);
      setOrders(sortedOrders);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, { status: newStatus });
      alert(`Sipariş #${orderId} durumu güncellendi: ${newStatus}`);
      fetchData(); // Listeyi yenile
    } catch (error) {
      console.error(error);
      alert('Durum güncellenemedi!');
    }
  };

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

      <div style={styles.tableContainer}>
        <h2 style={styles.tableTitle}>📄 Son Siparişler</h2>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Kullanıcı</th>
                <th style={styles.th}>Tutar</th>
                <th style={styles.th}>Adres</th>
                <th style={styles.th}>Durum</th>
                <th style={styles.th}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={styles.tr}>
                  <td style={styles.td}>#{order.id}</td>
                  <td style={styles.td}>Kullanıcı {order.appUserId || '?'}</td>
                  <td style={styles.td}>{order.totalPrice ? `${order.totalPrice}₺` : '-'}</td>
                  <td style={styles.td}>{order.deliveryAddress || '-'}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: order.status === 'Delivered' ? '#00b894' : 
                                       order.status === 'OnTheWay' ? '#0984e3' :
                                       order.status === 'Preparing' ? '#fdcb6e' : '#ff7675'
                    }}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <select
                      value={order.status || 'Pending'}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={styles.select}
                    >
                      <option value="Pending">Pending (Bekliyor)</option>
                      <option value="Preparing">Preparing (Hazırlanıyor)</option>
                      <option value="OnTheWay">OnTheWay (Yolda)</option>
                      <option value="Delivered">Delivered (Teslim Edildi)</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center' }}>Sipariş bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
  tableContainer: { marginTop: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  tableTitle: { marginTop: 0, color: '#2d3436' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px 15px', borderBottom: '2px solid #eee', color: '#636e72', fontWeight: 'bold' },
  td: { padding: '12px 15px', borderBottom: '1px solid #eee', color: '#2d3436' },
  tr: { transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f9f9f9' } },
  statusBadge: { padding: '4px 8px', borderRadius: '12px', color: 'white', fontSize: '0.85rem', fontWeight: 'bold' },
  select: { padding: '6px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' },
};

export default AdminPage;
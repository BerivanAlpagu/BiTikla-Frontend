import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';

function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  
  const { addToCart, totalItems, totalPrice } = useCart(); // ← buraya

  useEffect(() => {
    restaurantService.getById(id)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!restaurant) return (
    <div style={styles.loading}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
        🍕
      </motion.div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Geri butonu */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        style={styles.backButton}
      >
        ← Geri
      </motion.button>

      {/* Restoran Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.header}
      >
        <img
          src={`https://picsum.photos/seed/${id}/1200/300`}
          alt={restaurant.name}
          style={styles.headerImage}
        />
        <div style={styles.headerInfo}>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div style={styles.badges}>
            <span style={styles.badge}>⭐ {restaurant.rating}</span>
            <span style={styles.badge}>🕐 {restaurant.estimatedDeliveryTime} dk</span>
            <span style={styles.badge}>🛵 {restaurant.deliveryFee}₺</span>
          </div>
        </div>
      </motion.div>

      {/* Menü */}
      <div style={styles.menuContainer}>
        <h2 style={styles.menuTitle}>Menü</h2>
        <div style={styles.menuGrid}>
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              style={styles.menuItem}
            >
              <img
                src={`https://picsum.photos/seed/${id}${index}/200/150`}
                alt="yemek"
                style={styles.menuImage}
              />
              <div style={styles.menuInfo}>
                <h4 style={styles.menuName}>Yemek {index + 1}</h4>
                <p style={styles.menuDesc}>Lezzetli açıklama...</p>
                <div style={styles.menuFooter}>
                  <span style={styles.price}>₺{(Math.random() * 100 + 20).toFixed(2)}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart({ id: index, name: `Yemek ${index + 1}`, price: 50 })}
                    style={styles.addButton}
                  >
                    + Ekle
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sepet bildirimi */}
      <AnimatePresence>
        {totalItems > 0 && (
         <motion.button
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 100, opacity: 0 }}
           style={styles.cartButton}
           onClick={() => navigate('/cart')}
        >
           🛒 Sepete Git ({totalItems} ürün) — {totalPrice.toFixed(2)}₺
        </motion.button>
        )}
      </AnimatePresence>

      {/* Sepet butonu */}
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          style={styles.cartBar}
          onClick={() => navigate('/cart')}
        >
          <span>{totalItems} ürün</span>
          <span>Sepete Git →</span>
          <span>₺{totalPrice.toFixed(2)}</span>
        </motion.div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8f9fa', paddingBottom: '80px' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '3rem' },
  backButton: { margin: '20px', padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#ff6b35', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  header: { position: 'relative', marginBottom: '20px' },
  headerImage: { width: '100%', height: '250px', objectFit: 'cover' },
  headerInfo: { padding: '20px', backgroundColor: 'white' },
  badges: { display: 'flex', gap: '10px', marginTop: '10px' },
  badge: { backgroundColor: '#f0f0f0', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem' },
  menuContainer: { padding: '0 20px', maxWidth: '1200px', margin: '0 auto' },
  menuTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  menuItem: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  menuImage: { width: '100%', height: '150px', objectFit: 'cover' },
  menuInfo: { padding: '12px' },
  menuName: { margin: '0 0 4px', fontWeight: 'bold' },
  menuDesc: { margin: '0 0 10px', color: '#636e72', fontSize: '0.85rem' },
  menuFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontWeight: 'bold', color: '#ff6b35', fontSize: '1.1rem' },
  addButton: { backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' },
  cartAlert: { position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#00b894', color: 'white', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', zIndex: 1000 },
  cartBar: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ff6b35', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
};

export default RestaurantPage;
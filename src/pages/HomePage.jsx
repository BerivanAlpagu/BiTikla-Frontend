import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { restaurantService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    restaurantService.getActives()
      .then(res => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={styles.loadingContainer}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={styles.spinner}
      >
        🍔
      </motion.div>
      <p>Restoranlar yükleniyor...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={styles.header}
      >
        <h1 style={styles.logo}>🍔 BiTikla</h1>
        <p style={styles.subtitle}>Lezzetli yemekler kapına gelsin</p>
      </motion.div>

      {/* Arama */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={styles.searchContainer}
      >
        <input
          style={styles.searchInput}
          placeholder="🔍 Restoran veya yemek ara..."
        />
      </motion.div>

      {/* Restoranlar */}
      <div style={styles.grid}>
        {restaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
            style={styles.card}
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
          >
            <div style={styles.cardImage}>
              <img
                src={`https://picsum.photos/seed/${restaurant.id}/400/200`}
                alt={restaurant.name}
                style={styles.image}
              />
              <div style={styles.rating}>⭐ {restaurant.rating}</div>
            </div>
            <div style={styles.cardBody}>
              <h3 style={styles.restaurantName}>{restaurant.name}</h3>
              <p style={styles.description}>{restaurant.description}</p>
              <div style={styles.cardFooter}>
                <span style={styles.deliveryTime}>
                  🕐 {restaurant.estimatedDeliveryTime} dk
                </span>
                <span style={styles.deliveryFee}>
                  🛵 {restaurant.deliveryFee}₺
                </span>
                <span style={styles.minOrder}>
                  Min: {restaurant.minOrderPrice}₺
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    background: 'linear-gradient(135deg, #ff6b35, #f7c59f)',
    padding: '40px 20px',
    textAlign: 'center',
    color: 'white',
  },
  logo: {
    fontSize: '2.5rem',
    margin: 0,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.1rem',
    margin: '10px 0 0',
    opacity: 0.9,
  },
  searchContainer: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  searchInput: {
    width: '100%',
    padding: '15px 20px',
    borderRadius: '50px',
    border: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  cardImage: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  rating: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  cardBody: {
    padding: '16px',
  },
  restaurantName: {
    margin: '0 0 8px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#2d3436',
  },
  description: {
    margin: '0 0 12px',
    color: '#636e72',
    fontSize: '0.9rem',
    lineHeight: 1.4,
  },
  cardFooter: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  deliveryTime: {
    fontSize: '0.85rem',
    color: '#ff6b35',
    fontWeight: '600',
  },
  deliveryFee: {
    fontSize: '0.85rem',
    color: '#00b894',
    fontWeight: '600',
  },
  minOrder: {
    fontSize: '0.85rem',
    color: '#636e72',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '20px',
  },
  spinner: {
    fontSize: '3rem',
  },
};

export default HomePage;
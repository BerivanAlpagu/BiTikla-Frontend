import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { restaurantService, categoryService, menuItemService } from '../services/api';
import { useCart } from '../context/CartContext';

function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, totalItems, totalPrice } = useCart();

  useEffect(() => {
    Promise.all([
      restaurantService.getById(id),
      categoryService.getByRestaurant(id),
      menuItemService.getByRestaurant(id),
    ]).then(([restRes, catRes, menuRes]) => {
      setRestaurant(restRes.data);
      setCategories(catRes.data);
      setMenuItems(menuRes.data);
      if (catRes.data.length > 0) setSelectedCategory(catRes.data[0].id);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const filteredItems = selectedCategory
    ? menuItems.filter(x => x.categoryId === selectedCategory)
    : menuItems;

  if (loading) return (
    <div style={styles.loading}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
        🍕
      </motion.div>
    </div>
  );

  if (!restaurant) return <div>Restoran bulunamadı</div>;

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

      {/* Kategori Filtreleri */}
      {categories.length > 0 && (
        <div style={styles.categoryContainer}>
          <button
            style={{
              ...styles.categoryBtn,
              backgroundColor: selectedCategory === null ? '#ff6b35' : '#f0f0f0',
              color: selectedCategory === null ? 'white' : '#333',
            }}
            onClick={() => setSelectedCategory(null)}
          >
            Tümü
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              style={{
                ...styles.categoryBtn,
                backgroundColor: selectedCategory === cat.id ? '#ff6b35' : '#f0f0f0',
                color: selectedCategory === cat.id ? 'white' : '#333',
              }}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      )}

      {/* Menü */}
      <div style={styles.menuContainer}>
        <h2 style={styles.menuTitle}>Menü</h2>
        {filteredItems.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
            Bu kategoride ürün bulunamadı
          </p>
        ) : (
          <div style={styles.menuGrid}>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                style={styles.menuItem}
              >
                <img
                  src={`https://picsum.photos/seed/${item.id}/200/150`}
                  alt={item.name}
                  style={styles.menuImage}
                />
                <div style={styles.menuInfo}>
                  <h4 style={styles.menuName}>{item.name}</h4>
                  <p style={styles.menuDesc}>{item.description}</p>
                  <div style={styles.menuFooter}>
                    <span style={styles.price}>₺{item.price.toFixed(2)}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                      }, parseInt(id))}
                      style={styles.addButton}
                    >
                      + Ekle
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Sepet Butonu */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={styles.cartBar}
            onClick={() => navigate('/cart')}
          >
            <span>{totalItems} ürün</span>
            <span>Sepete Git →</span>
            <span>₺{totalPrice.toFixed(2)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8f9fa', paddingBottom: '80px', fontFamily: 'Arial, sans-serif' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '3rem' },
  backButton: { margin: '20px', padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#ff6b35', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  header: { marginBottom: '10px' },
  headerImage: { width: '100%', height: '250px', objectFit: 'cover' },
  headerInfo: { padding: '20px', backgroundColor: 'white' },
  badges: { display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' },
  badge: { backgroundColor: '#f0f0f0', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem' },
  categoryContainer: { display: 'flex', gap: '10px', padding: '15px 20px', overflowX: 'auto', backgroundColor: 'white', borderBottom: '1px solid #eee' },
  categoryBtn: { padding: '8px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.2s' },
  menuContainer: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
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
  cartBar: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ff6b35', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
};

export default RestaurantPage;
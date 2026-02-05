export default function ProductCard({ product }) {
  const styles = {
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    },
    title: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#1a202c",
      margin: "0",
      minHeight: "48px",
    },
    description: {
      fontSize: "0.9rem",
      color: "#4a5568",
      margin: "0",
      minHeight: "36px",
    },
    price: {
      fontSize: "1.1rem",
      fontWeight: "700",
      color: "#2563eb",
      margin: "4px 0",
    },
    rating: {
      fontSize: "0.9rem",
      color: "#f6ad55",
      margin: "0",
    },
    badgesContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginTop: "6px",
    },
    badge: {
      backgroundColor: "#e2e8f0",
      color: "#1a202c",
      fontSize: "0.75rem",
      fontWeight: "500",
      padding: "2px 6px",
      borderRadius: "6px",
    },
  };

  return (
    <div
      style={styles.card}
      onMouseOver={(e) =>
        Object.assign(e.currentTarget.style, {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        })
      }
      onMouseOut={(e) =>
        Object.assign(e.currentTarget.style, {
          transform: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        })
      }
    >
      <h3 style={styles.title}>{product.title}</h3>

      <p style={styles.description}>{product.description}</p>

      <p style={styles.price}>₹{product.price.toLocaleString()}</p>

      <p style={styles.rating}>⭐ Rating: {product.rating || 0}</p>

      {product.metadata && (
        <div style={styles.badgesContainer}>
          {product.metadata.color && (
            <span style={styles.badge}>Color: {product.metadata.color}</span>
          )}
          {product.metadata.storage && (
            <span style={styles.badge}>
              Storage: {product.metadata.storage} GB
            </span>
          )}
          {product.metadata.ram && (
            <span style={styles.badge}>RAM: {product.metadata.ram} GB</span>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ products, query }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const styles = {
    noResults: {
      textAlign: "center",
      color: "#4a5568",
      fontSize: "1.1rem",
      marginTop: "40px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "20px",
      marginTop: "30px",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "30px",
      gap: "15px",
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#3182ce",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "0.9rem",
    },
    disabledButton: {
      padding: "8px 16px",
      backgroundColor: "#a0aec0",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "not-allowed",
      fontSize: "0.9rem",
    },
    pageInfo: {
      fontSize: "0.95rem",
      color: "#4a5568",
    },
  };

  if (!products.length) {
    return (
      <p style={styles.noResults}>
        {query
          ? `No results found for "${query}". Try something else.`
          : "Search for products to get started."}
      </p>
    );
  }

  return (
    <>
      <div style={styles.grid}>
        {currentProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={currentPage === 1 ? styles.disabledButton : styles.button}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            style={currentPage === totalPages ? styles.disabledButton : styles.button}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ProductList from "../components/ProductList";
import { searchProducts } from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [pageKey, setPageKey] = useState(0); // Used to reset pagination

  const handleSearch = async (q) => {
    setQuery(q);
    setPageKey((prev) => prev + 1); // Reset ProductList pagination on new search
    try {
      setLoading(true);
      const data = await searchProducts(q); // API returns { data: [...] }
      setProducts(data.data || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#1a202c",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "20px",
      textAlign: "center",
      color: "#1a202c",
    },
    loadingText: {
      textAlign: "center",
      fontSize: "1.2rem",
      color: "#4a5568",
      marginTop: "40px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 JumboTail Electronics Search</h1>

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <p style={styles.loadingText}>Loading...</p>
      ) : (
        <ProductList
          key={pageKey} // ensures pagination resets on new search
          products={products}
          query={query}
        />
      )}
    </div>
  );
}

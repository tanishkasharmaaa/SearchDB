import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      margin: "20px 0",
      flexWrap: "wrap",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#f1f5f9",
      borderRadius: "8px",
      padding: "8px 12px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      flex: "1",
      maxWidth: "500px",
    },
    input: {
      border: "none",
      outline: "none",
      flex: 1,
      fontSize: "1rem",
      backgroundColor: "transparent",
      padding: "6px 8px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    icon: {
      marginRight: "8px",
      fontSize: "1.2rem",
      color: "#4a5568",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputWrapper}>
        <span style={styles.icon}>🔍</span>
        <input
          type="text"
          style={styles.input}
          placeholder="Search iPhone, cheap phones, red color..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

      <button
        style={styles.button}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}
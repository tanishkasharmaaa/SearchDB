

# 🛒 JumboTail Electronics Search Engine

A **search engine for an e-commerce platform** targeting Tier-2 and Tier-3 cities in India, built with the **MERN stack**.  
Users can search for electronics (mobiles, laptops, accessories, headphones, gadgets) and get **ranked, relevant results** based on price, stock, ratings, and metadata.

---

## 🌐 Live Demo

Check out the live deployed frontend here:  
**[JumboTail Electronics Search Engine](https://search-db-seven.vercel.app/)**

## 📌 Features

### 1. Search Functionality
- Supports **natural language queries**: `"iPhone"`, `"sasta wala iPhone"`, `"iPhone 16 red color"`.
- Corrects spelling mistakes: e.g., `Ifone 16 → iPhone 16` using a custom spell-correct module.
- Supports **attribute-based filtering**: price, color, RAM, storage.
- Handles **Hinglish/English mix queries**.
- Graceful handling of empty or invalid queries.

### 2. Ranking Algorithm
- Products ranked using a **score-based system**:
  - Text relevance (MongoDB `$text` or regex fallback)
  - Popularity (`unitsSold`)
  - Rating and number of reviews
  - Price (asc/desc based on query intent)
  - Stock availability
  - Freshness (boost for new products)
- Flexible sorting: `price`, `rating`, `storage`.

### 3. Frontend
- Built with **React.js functional components**.
- Components:
  - `SearchBar.jsx` → Handles user input and API calls.
  - `ProductList.jsx` → Displays paginated results (5 products/page).
  - `ProductCard.jsx` → Renders product details with metadata.
- User feedback:
  - `"Search something to get started"` for empty queries.
  - `"No results found for ..."` for no matches.
- Responsive grid layout, clean typography, and professional UI.

### 4. Backend
- Node.js + Express API service.
- MongoDB for product storage.
- Handles edge cases:
  - Empty catalog
  - Queries with no matches
  - Spelling mistakes or partial matches
- **APIs**:
  - `POST /api/v1/product` → Add product
  - `PUT /api/v1/product/meta-data` → Update metadata
  - `GET /api/v1/search/product?query=<query>` → Search and rank products

### 5. Data Handling
- Stores **product metadata**: RAM, storage, screen size, brightness, color, etc.
- Demo data: 1000+ synthetic products.
- Modular backend utilities:
  - `extractAttributes.js` → Parse queries
  - `spellCorrect.js` → Fix typos
  - `normalizeQuery.js` → Clean and normalize text
  - `cleanTextQuery.js` → Remove stopwords and irrelevant words

---

## ⚡ Technology Stack
- **Frontend:** React.js, JSX, inline CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Libraries:** Mongoose, Lodash (optional spell-correction library)
- **Tools:** Vite.js (frontend bundler), Postman (API testing)

---

## 🚀 Setup & Run

### Backend
1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env`:

```bash
MONGO_URI=<Your MongoDB connection string>
PORT=3000
```

3. Run server:

```bash
npm start
```

* API base: `http://localhost:3000/api/v1`

### Frontend

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create `.env`:

```bash
VITE_BACKEND_URI=<Your Backend url>
```

3. Run frontend:

```bash
npm run dev
```

* App opens at: `http://localhost:5173` (Vite default)

---

## 🔧 API Endpoints

* **Add Product**: `POST /api/v1/product`

```json
{
  "title": "iPhone 17",
  "description": "6.3-inch 120Hz OLED display",
  "rating": 4.2,
  "stock": 1000,
  "price": 81999,
  "mrp": 82999,
  "currency": "INR"
}
```

* **Update Product Metadata**: `PUT /api/v1/product/meta-data`

```json
{
  "productId": 101,
  "metadata": {
    "ram": "8GB",
    "screensize": "6.3 inches",
    "storage": 128,
    "brightness": 300
  }
}
```

* **Search Products**: `GET /api/v1/search/product?query=iPhone 16 red`

---

## 🎯 Search Behavior Examples

| Query Example         | Behavior                                          |
| --------------------- | ------------------------------------------------- |
| `iPhone 16 red color` | Shows iPhone 16, red variant first; covers last   |
| `realme under 30k`    | Shows affordable Realme phones in ascending price |
| `iPhone above 30k`    | Shows iPhone above 30k sorted descending          |
| `iPhone cover`        | Shows iPhone covers only                          |
| `Laptop` (if none)    | Displays `"No results found"`                     |
| Empty search          | Displays `"Search for products to get started"`   |

---

## 🗂 Project Structure

```
frontend/
├─ src/
│ ├─ components/
│ │ ├─ SearchBar.jsx
│ │ ├─ ProductCard.jsx
│ │ └─ ProductList.jsx
│ ├─ services/
│ │ └─ api.js
│ └─ App.jsx / Home.jsx
└─ index.css

backend/
├─ models/
│ └─ Product.js
├─ routes/
│ └─ productRoutes.js
├─ utils/
│ ├─ spellCorrect.js
│ ├─ extractAttributes.js
│ ├─ normalizeQuery.js
│ └─ cleanTextQuery.js
├─ server.js
└─ .env
```

---

## ⚡ Scoring & Ranking Logic

* **finalScore** = `textScore + popularityScore + ratingScore + priceIntentScore + availabilityScore + freshnessBoost`
* `textScore` → relevance via MongoDB text index
* `popularityScore` → log(unitsSold + 1)
* `ratingScore` → rating * log(ratingCount + 1)
* `priceIntentScore` → based on asc/desc query intent
* `availabilityScore` → stock-based boost
* `freshnessBoost` → slight boost for new products

---


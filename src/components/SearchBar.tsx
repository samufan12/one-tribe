import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, Trash2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts, Product } from "@/hooks/useProducts";

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 5;

// Popular search terms (could be fetched from backend in the future)
const TRENDING_SEARCHES = [
  "Traditional Kemis",
  "Ethiopian Coffee",
  "Habesha Dress",
  "Netela",
  "Gold Jewelry",
];

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { products } = useProducts();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  // Save search to history
  const saveToHistory = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...searchHistory.filter(h => h !== term)].slice(0, MAX_HISTORY_ITEMS);
    setSearchHistory(updated);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  // Remove single history item
  const removeHistoryItem = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = searchHistory.filter(h => h !== term);
    setSearchHistory(updated);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  };

  // Filter products based on search query
  useEffect(() => {
    if (query.trim().length > 0) {
      const searchLower = query.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
      setResults(filtered.slice(0, 6));
    } else {
      setResults([]);
    }
  }, [query, products]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      saveToHistory(query.trim());
      navigate(`/marketplace?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleProductClick = (productId: string) => {
    if (query.trim()) {
      saveToHistory(query.trim());
    }
    navigate(`/product/${productId}`);
    setQuery("");
    setIsOpen(false);
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    navigate(`/marketplace?search=${encodeURIComponent(term)}`);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  const showHistory = isOpen && query.trim() === "";
  const showResults = isOpen && query.trim() !== "";
  const hasHistory = searchHistory.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative flex items-center group">
        <Search className="absolute left-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search OneTribe"
          className="w-full pl-10 pr-20 h-9 border border-border/60 rounded-full bg-secondary/60 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5 transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-16 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="absolute right-1 px-3 h-7 bg-foreground text-background text-[12px] font-medium rounded-full hover:bg-foreground/90 transition-all"
        >
          Search
        </button>
      </div>

      {/* Search History & Trending Dropdown */}
      {showHistory && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {/* Recent Searches */}
          {hasHistory && (
            <>
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Recent Searches</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {searchHistory.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleHistoryClick(term)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left group"
                  >
                    <Clock size={14} className="text-muted-foreground shrink-0" />
                    <span className="flex-1 text-sm text-foreground truncate">{term}</span>
                    <button
                      onClick={(e) => removeHistoryItem(term, e)}
                      className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Trending Searches */}
          <div className={hasHistory ? "border-t border-border" : ""}>
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
              <TrendingUp size={12} className="text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Trending Searches</span>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleHistoryClick(term)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                >
                  <TrendingUp size={14} className="text-primary shrink-0" />
                  <span className="text-sm text-foreground">{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {results.length > 0 ? (
            <>
              <div className="max-h-96 overflow-y-auto">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/48"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} · ${product.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={handleSearch}
                className="w-full p-3 text-sm font-medium text-center text-primary hover:bg-muted/50 border-t border-border transition-colors"
              >
                View all results for "{query}"
              </button>
            </>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

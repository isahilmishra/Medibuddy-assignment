import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import MedicineCard from '../components/MedicineCard';

// Simple in-memory cache for API results
const searchCache = new Map();

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [empty, setEmpty] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const abortControllerRef = useRef(null);

  const fetchMedicines = useCallback(async (query) => {
    if (!query.trim()) {
      setResults([]);
      setEmpty(false);
      setError(null);
      return;
    }

    if (searchCache.has(query)) {
      setResults(searchCache.get(query));
      setEmpty(searchCache.get(query).length === 0);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setEmpty(false);

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${query}"&limit=20`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // 404 from this API means no results found for the query
          setResults([]);
          setEmpty(true);
          searchCache.set(query, []);
        } else {
          throw new Error(`API Error: ${response.status}`);
        }
      } else {
        const data = await response.json();
        const validResults = data.results || [];
        setResults(validResults);
        setEmpty(validResults.length === 0);
        searchCache.set(query, validResults);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request cancelled for', query);
      } else {
        console.error(err);
        setError('Something went wrong while fetching data. Please try again.');
        setResults([]);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchMedicines(debouncedSearchTerm);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearchTerm, fetchMedicines]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <h1>Medicine Search</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for medicines by brand name (e.g. advil, tylenol)..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search for medicines"
        />
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Searching for medicines...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && empty && (
        <div className="empty-state">
          <h2>No results found</h2>
          <p>We couldn't find any medicines matching "{debouncedSearchTerm}". Try a different brand name.</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="card-grid">
          {results.map((result) => {
            const id = result.id;
            return <MedicineCard key={id} data={result} id={id} />;
          })}
        </div>
      )}
    </div>
  );
}

export default SearchPage;

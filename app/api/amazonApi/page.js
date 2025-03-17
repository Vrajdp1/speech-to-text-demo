"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/app/components/loader/page";
import ProductCard from "@/app/components/productCard/page";

export default function AmazonResults({ query }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = "ff5e4f58596e5ce10b6b5e86606b9af49427197e";

  const fetchProducts = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch(
        `https://data.unwrangle.com/api/getter/?platform=amazon_search&search=${encodeURIComponent(query)}&country_code=us&api_key=${apiKey}`
      );
      const data = await response.json();

      if (data.success && data.results) {
        setProducts(data.results); // ✅ Set only the results
      } else {
        setProducts([]); // ✅ Ensure it's an empty array if no results
      }

    } catch (error) {
      console.error("Error fetching Amazon products:", error);
      setProducts([]); // ✅ Ensure it's an empty array on error
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };

  useEffect(() => {
    if (query) {
      fetchProducts();
    }
  }, [query]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <Loader />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <ProductCard products={products} />
      )}
    </>
  );
}

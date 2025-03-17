"use client";
import React from "react";
import { useState, useEffect } from "react";

export default function AmazonResults({ query }) {
  const [products, setProducts] = useState([]);
  
  const apiKey =  "ff5e4f58596e5ce10b6b5e86606b9af49427197e";

  const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://data.unwrangle.com/api/getter/?platform=amazon_search&search=${encodeURIComponent(query)}&country_code=us&api_key=${apiKey}`
        );
        const data = await response.json();
        if (data.success && data.results) {
          return data.results;
        }
      } catch (error) {
        console.error("Error fetching Amazon products:", error);
      }
    }

  useEffect(() => {
    const loadProducts = async () => {
      if (query) {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts || []);
      }
    };

    loadProducts();
  }, [query]);

  return (
<main className="p-6">
  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {products.map((product, index) => (
      <li key={index} className="w-72 border p-4 rounded-lg shadow-md bg-white">
        <a href={product.url} target="_blank" rel="noopener noreferrer">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-50 object-contain rounded-md"
          />
          <h3 className="mt-2 font-semibold text-lg">
            {product.name.split(" ").slice(0, 10).join(" ")}
            {product.name.split(" ").length > 10 && " ..."}
          </h3>
        </a>
        <p className="text-gray-700 mt-1">
          Price: <strong>${product.price || "N/A"}</strong>
        </p>
        {product.list_price && (
          <p className="text-gray-500 text-sm line-through">
            List Price: ${product.list_price}
          </p>
        )}
        <p className="text-yellow-500">⭐ {product.rating} / 5</p>
        {product.retailer_badge && (
          <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mt-2">
            {product.retailer_badge}
          </p>
        )}
        {product.is_prime && (
          <p className="text-sm text-purple-600 font-semibold">✅ Prime Available</p>
        )}
        {product.shipping_info && (
          <p className="text-sm text-green-600">{product.shipping_info}</p>
        )}
      </li>
    ))}
  </ul>
</main>


  );
}


  
       
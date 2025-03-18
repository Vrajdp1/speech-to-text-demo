"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/app/components/loader/page";
import ProductCard from "@/app/components/productCard/page"; // Default search product card
import NewDealsProductCard from "@/app/components/NewDealsProductCard/page";// New product card for new deals

export default function MarketplaceResults({ query, cardType = "default", limit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const ApiKey = "6197e81951a4fb1a876ba104d1db64d6710f454a";

  // Fetch Amazon products
  const fetchAmazonProducts = async () => {
    try {
      const response = await fetch(
        `https://data.unwrangle.com/api/getter/?platform=amazon_search&search=${encodeURIComponent(query)}&country_code=us&api_key=${ApiKey}`
      );
      const data = await response.json();
      return data.success && data.results
        ? data.results.map(product => ({ ...product, platform: "Amazon" }))
        : [];
    } catch (error) {
      console.error("Error fetching Amazon products:", error);
      return [];
    }
  };

  // Fetch Walmart products
  const fetchWalmartProducts = async () => {
    try {
      const response = await fetch(
        `https://data.unwrangle.com/api/getter/?platform=walmart_search&search=${encodeURIComponent(query)}&country_code=us&api_key=${ApiKey}`
      );
      const data = await response.json();
      return data.success && data.results
        ? data.results.map(product => ({ ...product, platform: "Walmart" }))
        : [];
    } catch (error) {
      console.error("Error fetching Walmart products:", error);
      return [];
    }
  };

  // Fetch data from both APIs
  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!query) return;

      setLoading(true);

      const [amazonProducts, walmartProducts] = await Promise.all([
        fetchAmazonProducts(),
        fetchWalmartProducts(),
      ]);

      let combinedProducts = [...amazonProducts, ...walmartProducts];

      // Sort best deals (Lowest price first, Highest rating as secondary)
      combinedProducts.sort((a, b) => {
        const priceA = a.price || Infinity;
        const priceB = b.price || Infinity;
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;

        return priceA - priceB || ratingB - ratingA;
      });

      // ✅ Apply limit if provided
      if (limit) {
        combinedProducts = combinedProducts.slice(0, limit);
      }

      setProducts(combinedProducts);
      setLoading(false);
    };

    fetchAllProducts();
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
        <>
          {cardType === "default" ? (
            <ProductCard products={products} />
          ) : (
            <NewDealsProductCard products={products} />
          )}
        </>
      )}
    </>
  );
}

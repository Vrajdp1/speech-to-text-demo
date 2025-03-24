"use client";
import React, { useState, useEffect, useMemo } from "react";
import Loader from "@/app/components/loader/page";
import ProductCard from "@/app/components/productCard/page"; // Default search product card
import NewDealsProductCard from "@/app/components/NewDealsProductCard/page"; // New product card for new deals
import { rankProducts } from "@/app/lib/aiRanker/page";

export default function MarketplaceResults({ query, platform = "both", brand = "", cardType = "default", limit }) {
  const [fullProducts, setFullProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const ApiKey = "52eac732a5af622dca24ed4620b06b0f09d86ed"; // API key for Unwrangle API put 4 stating characters of your API key

  // Fetch products when query, platform, or brand changes
  useEffect(() => {
    const fetchAllProducts = async () => {
      // Construct search query: combine brand and query if brand is provided
      const searchQuery = brand ? `${brand} ${query}`.trim() : query;

      // If searchQuery is empty, reset products and exit
      if (!searchQuery) {
        setFullProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Fetch Amazon products
      const fetchAmazonProducts = async () => {
        try {
          const response = await fetch(
            `https://data.unwrangle.com/api/getter/?platform=amazon_search&search=${encodeURIComponent(searchQuery)}&country_code=us&api_key=${ApiKey}`
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

        // Fetch costco products
        const fetchCostcoProducts = async () => {
          try {
            const response = await fetch(
              `https://data.unwrangle.com/api/getter/?platform=costco_search&search=${encodeURIComponent(searchQuery)}&country_code=us&api_key=${ApiKey}`
            );
            const data = await response.json();
            return data.success && data.results
              ? data.results.map(product => ({ ...product, platform: "Costco" }))
              : [];
          } catch (error) {
            console.error("Error fetching Costco products:", error);
            return [];
          }
        };



          

      // Fetch Walmart products
      const fetchWalmartProducts = async () => {
        try {
          const response = await fetch(
            `https://data.unwrangle.com/api/getter/?platform=walmart_search&search=${encodeURIComponent(searchQuery)}&country_code=us&api_key=${ApiKey}`
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

      let amazonProducts = [];
      let walmartProducts = [];
      let costcoProducts = [];


      // Fetch based on platform prop
      if (platform === "both" || platform === "amazon") {
        amazonProducts = await fetchAmazonProducts();
      }
      if (platform === "both" || platform === "walmart") {
        walmartProducts = await fetchWalmartProducts();
      }
      if (platform === "both" || platform === "costco") {
        costcoProducts = await fetchCostcoProducts();
      }


      // Combine products from fetched APIs
      let combinedProducts = [...amazonProducts, ...walmartProducts, ...costcoProducts];

      const rankedProducts = rankProducts(combinedProducts);
      setFullProducts(rankedProducts);
      setLoading(false);
    };

    fetchAllProducts();
  }, [query, platform, brand]);

  // Compute displayed products with limit applied
  const displayedProducts = useMemo(() => {
    return limit ? fullProducts.slice(0, limit) : fullProducts;
  }, [fullProducts, limit]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <Loader />
        </div>
      ) : displayedProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <>
          {cardType === "default" ? (
            <ProductCard products={displayedProducts} />
          ) : (
            <NewDealsProductCard products={displayedProducts} />
          )}
        </>
      )}
    </>
  );
}
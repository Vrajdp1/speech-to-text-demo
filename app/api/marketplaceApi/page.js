"use client";
import React, { useState, useEffect, useMemo } from "react";
import Loader from "@/app/components/loader/page";
import ProductCard from "@/app/components/productCard/page"; // Default search product card
import NewDealsProductCard from "@/app/components/NewDealsProductCard/page"; // New product card for new deals

export default function MarketplaceResults({ query, platform = "both", brand = "", cardType = "default", limit }) {
  const [fullProducts, setFullProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const ApiKey = "5197e81951a4fb1a876ba104d1db64d6710f454a"; // API key for Unwrangle API put 5 stating characters of your API key

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

                // Fetch bestbuy products
                const fetchBestbuyProducts = async () => {
                  try {
                    const response = await fetch(
                      `https://data.unwrangle.com/api/getter/?platform=bestbuy_search&search=${encodeURIComponent(searchQuery)}&country_code=us&api_key=${ApiKey}`
                    );
                    const data = await response.json();
                    return data.success && data.results
                      ? data.results.map(product => ({ ...product, platform: "BestBuy" }))
                      : [];
                  } catch (error) {
                    console.error("Error fetching BestBuy products:", error);
                    return [];
                  }
                };

                // Fetch homedepot products
                const fetchHomedepotProducts = async () => {
                  try {
                    const response = await fetch(
                      `https://data.unwrangle.com/api/getter/?platform=homedepot_search&search=${encodeURIComponent(searchQuery)}&country_code=us&api_key=${ApiKey}`
                    );
                    const data = await response.json();
                    return data.success && data.results
                      ? data.results.map(product => ({ ...product, platform: "HomeDepot" }))
                      : [];
                  } catch (error) {
                    console.error("Error fetching Home Depot products:", error);
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
      let bestbuyProducts = [];
      let homedepotProducts = [];


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
      if (platform === "both" || platform === "bestbuy") {
        bestbuyProducts = await fetchBestbuyProducts();
      }
      if (platform === "both" || platform === "homedepot") {
        homedepotProducts = await fetchHomedepotProducts();
      }


      // Combine products from fetched APIs
      let combinedProducts = [...amazonProducts, ...walmartProducts, ...costcoProducts, ...bestbuyProducts, ...homedepotProducts];

      // Sort by price (lowest first) and rating (highest first)
      combinedProducts.sort((a, b) => {
        const priceA = a.price || Infinity;
        const priceB = b.price || Infinity;
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return priceA - priceB || ratingB - ratingA;
      });

      setFullProducts(combinedProducts);
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
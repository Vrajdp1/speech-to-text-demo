"use client";
import React, { useState, useEffect, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/app/components/loader/page";
import ProductCard from "@/app/components/productCard/page";
import NewDealsProductCard from "@/app/components/NewDealsProductCard/page";

export default function MarketplaceResults({
  query,
  platform = "both",
  brand = "",
  cardType = "default",
  limit,
}) {
  const [fullProducts, setFullProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const ApiKey = "de897fe11c7b2e4f5cd640c1b3597e4b341ad053";

  const localFallbackRank = (products) => {
    return [...products].sort((a, b) => {
      const discountA = (a.list_price || a.price) - a.price;
      const discountB = (b.list_price || b.price) - b.price;
      const score = (p, d) => d * 0.5 + (p.rating || 0) * 10 - (p.price || 0);
      return score(b, discountB) - score(a, discountA);
    });
  };
  const cleanProductsForGPT = (products) => {
    return products.map((p) => ({
      name: p.name,
      price: p.price ?? null,
      list_price: p.list_price ?? null,
      rating: p.rating ?? null,
      total_ratings: p.total_ratings ?? null,
      thumbnail: p.thumbnail ?? null,
      url: p.url ?? null,
      platform: p.platform ?? "Unknown",
      retailer_badge: p.retailer_badge ?? null,
      is_prime: p.is_prime ?? false,
      shipping_info: p.shipping_info?.[0] ?? null,
    }));
  };
  

  const fetchGeminiRankedProducts = async (searchQuery, combinedProducts) => {
    try {
      const response = await fetch("/api/rankingengine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, products: combinedProducts }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Unknown Gemini error");
      }

      const data = await response.json();
      return data.deals || [];
    } catch (error) {
      toast.error("⚠️ Gemini failed. Using local fallback ranking.");
      
      return localFallbackRank(combinedProducts);
    }
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      const searchQuery = brand ? `${brand} ${query}`.trim() : query;
      if (!searchQuery) return setFullProducts([]);

      setLoading(true);

      const endpoints = {
        amazon: `https://data.unwrangle.com/api/getter/?platform=amazon_search&search=${encodeURIComponent(
          searchQuery
        )}&country_code=us&api_key=${ApiKey}`,
        walmart: `https://data.unwrangle.com/api/getter/?platform=walmart_search&search=${encodeURIComponent(
          searchQuery
        )}&country_code=us&api_key=${ApiKey}`,
        // costco: `https://data.unwrangle.com/api/getter/?platform=costco_search&search=${encodeURIComponent(
        //   searchQuery
        // )}&country_code=us&api_key=${ApiKey}`,
      };

      const platformsToFetch =
        platform === "both" ? ["amazon", "walmart"] : [platform];

      try {
        const results = await Promise.all(
          platformsToFetch.map(async (platformKey) => {
            try {
              const res = await fetch(endpoints[platformKey]);
              const data = await res.json();
        
              return data.success && data.results
                ? data.results
                    .slice(0, 10) // ✅ LIMIT TO 10 PER PLATFORM
                    .map((p) => ({
                      ...p,
                      platform:
                        platformKey.charAt(0).toUpperCase() +
                        platformKey.slice(1),
                    }))
                : [];
            } catch (err) {
              console.error(`Fetch failed for ${platformKey}:`, err);
              return [];
            }
          })
        );
        

        const combinedProducts = results.flat();
const cleanedProducts = cleanProductsForGPT(combinedProducts);
        if (combinedProducts.length === 0) {
          toast("No products found.");
          setFullProducts([]);
        } else {
          const ranked = await fetchGeminiRankedProducts(
            searchQuery,
            cleanedProducts
          );
          setFullProducts(ranked);
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
      }

      setLoading(false);
    };

    fetchAllProducts();
  }, [query, platform, brand, retryTrigger]);

  const displayedProducts = useMemo(
    () => (limit ? fullProducts.slice(0, limit) : fullProducts),
    [fullProducts, limit]
  );

  return (
    <>
      <Toaster />

      <div
        className={`transition-opacity duration-500 ease-in-out ${
          loading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {displayedProducts.length === 0 && !loading ? (
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              No products found or ranking failed.
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setRetryTrigger((prev) => prev + 1)}
            >
              🔁 Retry
            </button>
          </div>
        ) : cardType === "default" ? (
          <ProductCard products={displayedProducts} />
        ) : (
          <NewDealsProductCard products={displayedProducts} />
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center h-80 transition-opacity duration-300 ease-in-out opacity-100">
          <Loader />
        </div>
      )}
    </>
  );
}

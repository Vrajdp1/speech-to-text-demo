"use client";
import React, { useState, useEffect } from "react";
import MarketplaceResults from "@/app/api/marketplaceApi/page";// API request component

export default function NewDeals() {
  const [query, setQuery] = useState("best deals");

  useEffect(() => {
    setQuery("best deals");
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 m-5">Trending Products</h2>

      {/* ✅ Using cardType="newDeals" to display NewDealsProductCard */}
      <MarketplaceResults query={query} cardType="newDeals" limit={12} />
    </div>
  );
}

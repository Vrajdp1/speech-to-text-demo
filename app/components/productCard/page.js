"use client";
import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";

const ProductCard = ({products}) => {
  const [isFavorited, setIsFavorited] = useState(false);

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
};

export default ProductCard;

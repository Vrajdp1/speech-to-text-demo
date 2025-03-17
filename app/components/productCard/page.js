"use client";
import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";

const ProductCard = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card className="w-72 border rounded-lg shadow-md p-4">
      <div className="relative">
        <img
          src="/path-to-your-image/image.png" // Replace with the actual image path
          alt="Continental Coffee STRONG Instant Coffee"
          className="w-full h-48 object-cover rounded-md"
        />
        <button
          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart
            className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"}`}
          />
        </button>
      </div>
      <CardContent className="mt-3">
        <h2 className="text-sm font-semibold">
          Continental Coffee STRONG Instant Coffee
        </h2>
        <p className="text-xs text-gray-500">1 kg, Chicory Flavoured</p>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded-md text-xs font-bold">
            <Star className="w-4 h-4 mr-1" /> 4.3
          </div>
          <span className="text-xs text-gray-500">(5,577)</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold">₹924</span>
          <span className="text-sm text-gray-400 line-through">₹925</span>
        </div>

        <p className="text-sm text-red-600 font-semibold mt-1">
          Only few left
        </p>

        <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

"use client";
import React, { useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"; // Import arrow icons

const NewDealsProductCard = ({ products }) => {
  const scrollRef = useRef(null); // Reference to the scroll container

  // Function to calculate discount percentage
  const calculateDiscount = (listPrice, discountPrice) => {
    if (!listPrice || !discountPrice) return null; // Avoid errors if missing prices
    const discount = ((listPrice - discountPrice) / listPrice) * 100;
    return Math.round(discount); // Round to nearest whole number
  };

  // Function to scroll left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Auto-scrolling effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        if (scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth) {
          // If at the end, go back to the start
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Otherwise, scroll forward
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No new deals found.</p>
      ) : (
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>

          {/* Scrollable Product Container */}
          <div ref={scrollRef} className="flex overflow-hidden space-x-4 p-4">
            {products.slice(0, 12).map((product, index) => {
              const discountPercentage = calculateDiscount(product.list_price, product.price);

              return (
                <div key={index} className="min-w-[220px] w-56 border p-3 rounded-lg shadow-md bg-white">
                  <a href={product.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-32 object-contain rounded-md"
                    />
                  </a>

                  <h3 className="font-semibold text-sm text-gray-900 mt-2">
                    {product.name.split(" ").slice(0, 6).join(" ")}
                    {product.name.split(" ").length > 6 && " ..."}
                  </h3>

                  {product.list_price && (
                    <p className="text-gray-500 text-sm line-through">
                      List Price: ${product.list_price}
                    </p>
                  )}

                  <p className="text-green-600 font-bold">
                    Discount Price: ${product.price || "N/A"}
                  </p>

                  {/* ✅ Show Discount Percentage */}
                  {discountPercentage && (
                    <p className="text-red-500 text-sm font-semibold">
                      Save {discountPercentage}% 🔥
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      )}
    </>
  );
};

export default NewDealsProductCard;

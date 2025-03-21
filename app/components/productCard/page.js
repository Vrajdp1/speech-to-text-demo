"use client";

const marketplaceLogos = {
  Amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  Walmart: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg",
  Costco: "https://companieslogo.com/img/orig/COST_BIG-8d2fd259.png",
  HomeDepot: "https://companieslogo.com/img/orig/HD-c2e64c95.png",
  BestBuy: "https://companieslogo.com/img/orig/BBY_BIG-91ae3bf2.png",
};

const ProductCard = ({products}) => {

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
              <p className="text-yellow-500">Rating: ⭐ {product.rating} / 5</p>
              {product.retailer_badge && (
                <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mt-2">
                  {product.retailer_badge}
                </p>
              )}

{/* ✅ Marketplace Logo */}
{product.platform && (
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={marketplaceLogos[product.platform]}
                    alt={product.platform}
                    className="h-6 w-auto"
                  />
     </div>
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

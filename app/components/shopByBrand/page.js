import React from "react";
import { Card } from "@/ui/card";

const InfoCard = ({ imageSrc, altText, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <Card className="max-w-[160px] p-3 shadow-lg rounded-lg flex flex-col items-center m-3">
        <img 
          src={imageSrc} 
          alt={altText} 
          className="w-full h-36 object-contain"
        />
      </Card>
    </a>
  );
};

const RetailCards = () => {
  const retailers = [
    { imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/500px-Walmart_logo.svg.png", altText: "Walmart Logo", link: "./components/brands/walmart" },
    { imageSrc: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", altText: "Amazon Logo", link: "./components/brands/amazon" },
    { imageSrc: "https://companieslogo.com/img/orig/COST_BIG-8d2fd259.png?t=1720244491", altText: "Costco Logo", link: "./components/brands/costco" },
    { imageSrc: "https://companieslogo.com/img/orig/HD-c2e64c95.png?t=1720244492", altText: "Home Depot Logo", link: "./components/brands/homedepot" },
    { imageSrc: "https://companieslogo.com/img/orig/BBY_BIG-91ae3bf2.png?t=1720244490", altText: "Best Buy Logo", link: "./components/brands/bestbuy" }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Shop by Store</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {retailers.map((retailer, index) => (
          <InfoCard key={index} imageSrc={retailer.imageSrc} altText={retailer.altText} link={retailer.link} />
        ))}
      </div>
    </div>
  );
};

export default RetailCards;

'use client';

import React, { useState } from 'react';
import { AuthContextProvider } from '@/app/utils/auth-context'; // ✅ import the context provider
import Header from '@/app/components/header/page';
import Footer from '@/app/components/Footer/Page';
import SearchBar from '@/app/components/searchBar/page';
import MarketplaceResults from '@/app/api/marketplaceApi/page';

const SmartBudgetingPage = () => {
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('boots');

  const budgets = [100, 150, 200];
  const categories = ['boots', 'clothing', 'electronics', 'kitchen', 'fitness'];

  return (
    <AuthContextProvider> {/* ✅ wrap your page */}
      <Header />
      <SearchBar />

      <div className="text-center mt-6 px-4">
        <h1 className="text-2xl font-bold mb-4">💡 Smart Budgeting</h1>

        {/* Budget Selector */}
        <h2 className="text-lg mb-2">Select a Budget</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {budgets.map((budget) => (
            <button
              key={budget}
              className={`px-4 py-2 rounded border ${
                selectedBudget === budget ? 'bg-green-600 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setSelectedBudget(budget)}
            >
              Under ${budget}
            </button>
          ))}
        </div>

        {/* Category Selector */}
        <h2 className="text-lg mb-2">Choose a Product Category</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded border ${
                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Display Results */}
        {selectedBudget && (
          <>
            <h3 className="text-md font-semibold mb-4">
              Showing <span className="text-blue-600">{selectedCategory}</span> under ${selectedBudget}
            </h3>
            <MarketplaceResults
              query={selectedCategory}
              limit={40}
              platform="both"
              maxPrice={selectedBudget}
            />
          </>
        )}
      </div>

      <Footer />
    </AuthContextProvider>
  );
};

export default SmartBudgetingPage;

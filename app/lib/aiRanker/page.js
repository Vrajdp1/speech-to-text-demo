export const rankProducts = (products) => {
    const ranked = products.map(p => {
      const price = p.price || 9999;
      const rating = p.rating || 0;
      const score = (rating * 20) - price;
  
      const badges = [];
  
      if (price < 100) badges.push("Under $100");
      return { ...p, score, badges };
    }).sort((a, b) => b.score - a.score);
  
    if (ranked.length > 0) ranked[0].badges.unshift("Best Deal");
  
    const topRated = [...ranked].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (topRated.length > 0 && !topRated[0].badges.includes("Best Deal")) {
      topRated[0].badges.unshift("Top Rated");
    }
  
    return ranked;
  };
  
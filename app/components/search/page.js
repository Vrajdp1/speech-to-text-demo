"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AmazonResults from "@/app/api/marketplaceApi/page";
import Header from "@/app/components/header/page";
import SearchBar from "../searchBar/page";
import Footer from "@/app/components/Footer/Page";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  return (
    <>
      <Header />
      <SearchBar />
      <AmazonResults query={searchQuery} limit={50} platform="both" />
      <Footer />
    </>
  );
};

export default SearchResults;

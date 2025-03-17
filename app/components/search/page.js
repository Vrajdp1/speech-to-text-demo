"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AmazonResults from "@/app/api/amazonApi/page";
import Header from "@/app/components/header/page";
import SearchBar from "../searchBar/page";

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
      <AmazonResults query={searchQuery} />
    </>
  );
};

export default SearchResults;

"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import AmazonResults from "@/app/api/amazonApi/page";
import Header from "@/app/components/header/page";
const SearchResults = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(
         () => searchParams.get('q') || ""
        
        );

    useEffect(() => {
        if (router.isReady) {
          setSearchQuery(searchParams.get('q') || '');
          // setSearchQuery((router.query && router.query.q) ?? "");
        }
      }, [router.isReady, useSearchParams]);


  return (
    <>
      <Header />
   <AmazonResults query={searchQuery} />
    </>
  );
};

export default SearchResults;

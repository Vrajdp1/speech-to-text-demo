"use client";
import React from 'react';
import Header from '@/app/components/header/page';
import SearchBar from '@/app/components/searchBar/page';
import Footer from '@/app/components/Footer/Page';
import {useState, useEffect} from 'react';
import { AuthContextProvider } from '@/app/utils/auth-context';
import MarketplaceResults from '@/app/api/marketplaceApi/page';

const HomedepotPage = () => {
     const [query, setQuery] = useState("trending");
    
      useEffect(() => {
        setQuery("trending");
      }, []);
    return (
        <>
        <AuthContextProvider>
        <Header />
        <SearchBar />
        <MarketplaceResults query={query} limit={30} platform='homedepot' /> 
        <Footer />
        </AuthContextProvider>
        </>
    );
};

export default HomedepotPage;
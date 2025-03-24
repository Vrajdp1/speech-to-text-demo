'use client';
import { useState, useRef } from 'react';
import { encodeWAV } from './utils/audioUtils';
import Header from './components/header/page';
import { AuthContextProvider } from './utils/auth-context';
import SearchBar from './components/searchBar/page';
import Footer from "./components/Footer/Page";
import NewDeals from './components/newDeals/page';
import RetailCards from './components/shopByBrand/page';
export default function Page() {


  return (
    <AuthContextProvider>
      <Header />
    <SearchBar />
    {/* anyone who is doing voice search go to /components/searchBar */}

      {/* Button to start and stop recording (just for testing)*/}
     

 
      <NewDeals/>
      <RetailCards/>
      <Footer/>
    </AuthContextProvider>
  );
}

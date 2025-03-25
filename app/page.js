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
     <NewDeals/>
      <RetailCards/>
      <Footer/>
    </AuthContextProvider>
  );
}

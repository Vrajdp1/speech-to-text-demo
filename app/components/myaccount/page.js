"use client";
import Profile from './profile';
import './myAccount.css';
import Header from '../header/page';

function MyAccount() {

  return (
    <>
    <Header/>
      <div className="mt-32">

      <Profile/>
      </div>
    </>
    
  );
}

export default MyAccount;
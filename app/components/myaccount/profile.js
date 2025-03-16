import React from "react";
import { useUserAuth } from "@/app/utils/auth-context";
import "./Profile.css"

const Profile = () => {
  const { user } = useUserAuth();
  return (
    <div className="profile p-4 max-w-md mx-auto border rounded-lg shadow-md bg-white">
      {user ? (
        <div className="text-center">
          <img
            src="https://xsgames.co/randomusers/avatar.php?g=male"
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-3"
          />
          <p className="text-lg font-semibold">Name: {user.displayName}</p>
          <p className="text-sm text-gray-600">Email: {user.email}</p>
          <p className="text-sm text-gray-600">
            Account Created: {new Date(user.metadata.creationTime).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Last Login: {new Date(user.metadata.lastSignInTime).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Please sign in to view your profile</p>
      )}
    </div>
  );
};

export default Profile;

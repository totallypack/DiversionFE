import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getMyProfile } from "../../managers/profileManager";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const profile = await getMyProfile();
      setIsAdmin(profile.isAdmin || false);
    } catch (err) {
      console.error("Failed to check admin status:", err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

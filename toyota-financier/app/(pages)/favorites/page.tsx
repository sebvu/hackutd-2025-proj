"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <div style={{ padding: "2rem" }}>
        <h1>Your Favorite Cars</h1>
        <p>Here’s your saved list of cars.</p>
      </div>
    </ProtectedRoute>
  );
}

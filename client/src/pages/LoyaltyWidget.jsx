import React, { useEffect, useState, useCallback } from "react";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";

const LoyaltyWidget = ({ userId }) => {
  const [points, setPoints] = useState(0);
  const [redeemAmount, setRedeemAmount] = useState(0);

  const fetchPoints = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(apis().loyaltyPoints(userId), {
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setPoints(data.points || 0);
    } catch (err) {
      console.error("❌ Loyalty fetch failed:", err);
      toast.error("Failed to load loyalty points");
    }
  }, [userId]);

  const handleRedeem = async () => {
    if (redeemAmount <= 0 || redeemAmount > points) {
      toast.error("Invalid amount");
      return;
    }

    try {
      const res = await fetch(apis().redeemPoints, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, pointsToRedeem: redeemAmount }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Redemption failed");
        return;
      }

      const data = await res.json();
      setPoints(data.currentPoints);
      setRedeemAmount(0); // Reset input
      toast.success(`🎉 Redeemed ${redeemAmount} points`);
    } catch (err) {
      console.error("Redeem error:", err);
      toast.error("Failed to redeem points");
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  return (
    <div className="card p-3 my-4">
      <h5>🎁 Loyalty Points</h5>
      <p className="text-success">
        🎯 You have <strong>{points}</strong> loyalty points available.
      </p>
      <input
        type="number"
        className="form-control my-2"
        placeholder="Points to redeem"
        value={redeemAmount}
        onChange={(e) => setRedeemAmount(Number(e.target.value))}
      />
      <button className="btn btn-sm btn-success" onClick={handleRedeem}>
        Redeem Points
      </button>
    </div>
  );
};

export default LoyaltyWidget;

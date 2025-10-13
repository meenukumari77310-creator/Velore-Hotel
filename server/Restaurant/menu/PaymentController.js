// controllers/paymentController.js
import Payment from "../../models/payment.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Payment.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Payment.findByIdAndUpdate(id, { status }, { new: true });

    // Removed Transaction update here

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order", error: err });
  }
};



export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await Payment.findByIdAndDelete(id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order", error: err });
  }
};



export const getCategorySales = async (req, res) => {
  try {
    // Fetch all completed payments, populate dish and category
    const payments = await Payment.find({ status: "completed" })
      .populate({
        path: "dishId",
        populate: { path: "category" },
      });

    const categorySales = {};

    payments.forEach((payment) => {
      const categoryName = payment.dishId?.category?.name || "Uncategorized";
      categorySales[categoryName] = (categorySales[categoryName] || 0) + payment.totalAmount;
    });

    const result = Object.entries(categorySales).map(([name, value]) => ({
      name,
      value,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch category sales", error: err });
  }
};

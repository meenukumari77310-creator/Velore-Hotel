import Review from '../models/review.js';

// POST /api/reviews (User Adds Review)
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = new Review({
      user: req.user?._id,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error("Add Review Error:", err);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// GET /api/reviews (Admin Gets All Reviews)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// DELETE /api/reviews/:id (Admin Deletes Review)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete Review Error:", err);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    console.error("Update Review Error:", err);
    res.status(500).json({ error: "Failed to update review" });
  }
};

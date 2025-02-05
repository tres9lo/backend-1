
// Seeker Model
const SeekerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    credits: { type: Number, default: 0 },
  });
  
  const Seeker = mongoose.model("Seeker", SeekerSchema);
  module.exports = Seeker;

// Finder Model
const FinderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    credits: { type: Number, default: 0 },
  });
  
  const Finder = mongoose.model("Finder", FinderSchema);
  module.exports = Finder;
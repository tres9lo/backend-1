const mongoose = require("mongoose");

const rwandaDistricts = [
    "Nyarugenge", "Gasabo", "Kicukiro", "Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana",
    "Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango",
    "Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo",
    "Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"
  ];
const DocSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: [
        "Rwandan National ID",
        "Rwandan Driving License",
        "Plot License",
        "Rwandan Vehicle Identification Document",
        "Other",
      ],
      required: true,
    },
    proofPicture: { type: String, required: true },
    locationFound: {
      district: { type: String, required: true, enum: rwandaDistricts },
      sector: { type: String, required: true },
    },
    finderId: { type: mongoose.Schema.Types.ObjectId, ref: "Finder", required: true },
    claimerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seeker" },
    delivered: { type: Boolean, default: false },
  }, { timestamps: true });
  
  const Doc = mongoose.model("Doc", DocSchema);
  module.exports = Doc;
  
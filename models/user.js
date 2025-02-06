const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const rwandaDistricts = [
  "Nyarugenge",
  "Gasabo",
  "Kicukiro",
  "Bugesera",
  "Gatsibo",
  "Kayonza",
  "Kirehe",
  "Ngoma",
  "Nyagatare",
  "Rwamagana",
  "Gisagara",
  "Huye",
  "Kamonyi",
  "Muhanga",
  "Nyamagabe",
  "Nyanza",
  "Nyaruguru",
  "Ruhango",
  "Burera",
  "Gakenke",
  "Gicumbi",
  "Musanze",
  "Rulindo",
  "Karongi",
  "Ngororero",
  "Nyabihu",
  "Nyamasheke",
  "Rubavu",
  "Rusizi",
  "Rutsiro",
];

// User Model
const UserSchema = new mongoose.Schema(
  {
    names: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
    homeLocation: { type: String, required: true, enum: rwandaDistricts },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

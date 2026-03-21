require("dotenv").config();
const mongoose = require("mongoose");

async function dropIndex() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const courses = db.collection("courses");
  const indexes = await courses.indexes();
  const nameIndex = indexes.find((i) => i.name === "name_1");
  if (nameIndex) {
    await courses.dropIndex("name_1");
    console.log("Dropped stale name_1 index");
  } else {
    console.log("No name_1 index found");
  }
  await mongoose.connection.close();
  process.exit(0);
}
dropIndex().catch((err) => {
  console.error(err);
  process.exit(1);
});

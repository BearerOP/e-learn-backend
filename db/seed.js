require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User, Course, Track } = require("../src/models/schema");

const seedUsers = [
  // Teachers (role: both = instructor + student)
  {
    username: "parminder",
    email: "parminder@gmail.com",
    password: "Parminder@123",
    role: "both",
    instructorDetails: {
      bio: "Full-stack developer and instructor. Passionate about teaching web development and modern frameworks.",
      expertise: ["Programming", "Web Development", "Node.js", "React"],
    },
  },
  {
    username: "ankit",
    email: "ankit@gmail.com",
    password: "Ankit@123",
    role: "both",
    instructorDetails: {
      bio: "UI/UX designer and digital marketing expert. Helping students build impactful digital presence.",
      expertise: ["Design", "Marketing", "UI/UX", "Figma", "SEO"],
    },
  },
  // Students (for testing purchases, cart, etc.)
  {
    username: "teststudent",
    email: "student@test.com",
    password: "Student@123",
    role: "student",
    instructorDetails: {},
  },
  {
    username: "demo_user",
    email: "demo@test.com",
    password: "Demo@123",
    role: "student",
    instructorDetails: {},
  },
];

const dummyCourses = [
  {
    title: "Introduction to React & TypeScript",
    description: "Learn the fundamentals of React and TypeScript for building modern web applications. Covers components, hooks, state management, and TypeScript best practices.",
    price: 1299,
    category: "programming",
    subCategory: "frontend-development",
    tags: ["react", "typescript", "web development"],
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
  },
  {
    title: "Node.js Backend Development",
    description: "Build scalable backend APIs with Node.js and Express. Learn RESTful design, authentication, MongoDB, and deployment strategies.",
    price: 1499,
    category: "programming",
    subCategory: "backend-development",
    tags: ["nodejs", "express", "api", "mongodb"],
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Master the principles of user interface and experience design. Create intuitive, accessible designs with Figma and modern design systems.",
    price: 999,
    category: "design",
    subCategory: "user-interface",
    tags: ["ui", "ux", "figma", "design"],
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
  },
  {
    title: "Digital Marketing Essentials",
    description: "Learn SEO, social media marketing, content strategy, and analytics. Grow your online presence and reach your target audience effectively.",
    price: 899,
    category: "marketing",
    subCategory: "digital-marketing",
    tags: ["marketing", "seo", "social media", "analytics"],
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
  },
  {
    title: "Data Science with Python",
    description: "From data analysis to machine learning. Learn Pandas, NumPy, Matplotlib, and Scikit-learn for real-world data science projects.",
    price: 1999,
    category: "programming",
    subCategory: "data-science",
    tags: ["python", "data science", "machine learning", "pandas"],
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
  },
  {
    title: "Personal Development & Productivity",
    description: "Boost your productivity, goal-setting, and time management. Develop habits that help you achieve more in less time.",
    price: 599,
    category: "personal-development",
    subCategory: "other",
    tags: ["productivity", "habits", "goals", "time management"],
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const createdUsers = [];

    for (const userData of seedUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`User ${userData.email} already exists, skipping`);
        createdUsers.push(existing);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.email} (${user.role})`);
    }

    const parminder = createdUsers.find((u) => u.email === "parminder@gmail.com");
    const ankit = createdUsers.find((u) => u.email === "ankit@gmail.com");
    const instructors = [parminder, ankit].filter(Boolean);

    if (instructors.length === 0) {
      console.log("No instructors found. Create users first.");
      process.exit(1);
    }

    for (let i = 0; i < dummyCourses.length; i++) {
      const courseData = dummyCourses[i];
      const instructor = instructors[i % instructors.length];

      const existing = await Course.findOne({
        title: courseData.title,
        createdBy: instructor._id,
      });

      if (existing) {
        console.log(`Course "${courseData.title}" already exists, skipping`);
        continue;
      }

      const course = await Course.create({
        ...courseData,
        createdBy: instructor._id,
        status: "published",
      });

      console.log(`Created course: ${course.title} by ${instructor.username}`);
    }

    console.log("\nSeed completed successfully!");
    console.log("\nLogin credentials:");
    console.log("  Teachers (instructors):");
    console.log("    parminder@gmail.com / Parminder@123");
    console.log("    ankit@gmail.com / Ankit@123");
    console.log("  Students:");
    console.log("    student@test.com / Student@123");
    console.log("    demo@test.com / Demo@123");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();

const express = require("express");
const Student = require("../models/Student");
const router = express.Router();


// ✅ Get All Students (for course selection dropdown)
router.get("/", async (req, res) => {
  try {
    const students = await Student.find({}, "_id firstName lastName studentNumber"); // Return only necessary fields
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a New Student with Hobbies
router.post("/add", async (req, res) => {
  try {
    const { studentNumber, firstName, lastName, email, password, program, hobbies } = req.body;

    const newStudent = new Student({
      studentNumber,
      firstName,
      lastName,
      email,
      password,
      program,
      hobbies, // ✅ Save hobbies array
    });

    await newStudent.save();
    res.status(201).json({ message: "✅ Student added successfully!", student: newStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ Get All Students with Their Courses
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("courses", "courseCode courseName section semester");
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;





module.exports = router;

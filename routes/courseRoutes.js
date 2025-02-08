const express = require("express");
const Course = require("../models/Course");
const Student = require("../models/Student");
const router = express.Router();

// ✅ Add a New Course and Assign it to a Student
router.post("/add", async (req, res) => {
  try {
    const { courseCode, courseName, section, semester, studentId } = req.body;

    // ✅ Check if studentId is provided
    if (!studentId) {
      return res.status(400).json({ error: "❌ Student ID is required" });
    }

    // ✅ Fetch student from DB
    const student = await Student.findById(studentId);
    
    console.log("Fetched Student:", student); // ✅ Debug log
    
    if (!student) {
      return res.status(404).json({ error: "❌ Student not found" });
    }

    // ✅ Check if course already exists
    const existingCourse = await Course.findOne({ courseCode, section, semester });
    if (existingCourse) {
      return res.status(400).json({ error: "❌ Course already exists in this section/semester" });
    }

    // ✅ Create and save the new course
    const newCourse = new Course({ courseCode, courseName, section, semester, students: [studentId] });
    await newCourse.save();

    // ✅ Ensure `courses` field exists before pushing
    if (!student.courses) {
      student.courses = []; // ✅ Initialize courses array if undefined
    }

    student.courses.push(newCourse._id); // ✅ Now, push will not fail
    await student.save();

    res.status(201).json({ message: "✅ Course added successfully!", course: newCourse });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});

module.exports = router;

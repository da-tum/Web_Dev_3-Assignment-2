const express = require("express");
const router = express.Router();
const students = require("../data/students");

// getting all the students
router.get("/", (req, res) => {
  res.json(students);
});

// getting students based on their id
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((student) => student.id === id);
  
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// post request
router.post("/", (req, res) => {
  const newStudent = req.body;

  if (!newStudent.id || !newStudent.name || !newStudent.course) {
    return res.status(400).json({ message: "All student fields are required" });
  }

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// put request
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((student) => student.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  if (!req.body.name || !req.body.course) {
    return res.status(400).json({ message: "All student fields are required" });
  }

  student.name = req.body.name;
  student.course = req.body.course;

  res.json(student);
});

// delete operation
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex((student) => student.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  students.splice(studentIndex, 1);
  res.json({ message: "Student deleted successfully" });
});

module.exports = router;

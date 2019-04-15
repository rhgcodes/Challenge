var request = require('request')
var Student = require('../models/Student')

// Defining methods for the StudentController
exports.allStudents = (req, res, next) => {
  console.log("pulling student data")
  Student.find({}).then((students) => {
    console.log("student data found")
    res.send(students)
  })
}

exports.createStudent = (req, res, next) => {
  req.assert('firstname', 'First name is required').notEmpty();
  req.assert('surname', 'Surname is required').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('age', 'Age must be a number').isNumeric();
  req.assert('grade', 'Grade must be a number').isNumeric();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  let errors = req.validationErrors();

  if (errors) {
    console.log(req.body);
    console.log(errors);
    return res.status(400).send(errors);
  }
  else {
    console.log("attempting to create student");
    let student = new Student({
      firstname: req.body.firstname,
      surname: req.body.surname,
      email: req.body.email,
      age: req.body.age,
      grade: req.body.grade
    });
    console.log("saving student");
    student.save()
    .then(res.send(student))
    .catch(err => {
      console.log(err)
    })
  }
}

exports.updateStudent = (req, res, next) => {
  let sentStudent = {
    firstname: req.body.firstname,
    surname: req.body.surname,
    email: req.body.email,
    age: req.body.age,
    grade: req.body.grade
  }
  let foundStudent = Student.findById(req.params.id, function(err,foundStudent){
    foundStudent.firstname = req.body.firstname
    foundStudent.surname = req.body.surname
    foundStudent.email = req.body.email
    foundStudent.age = req.body.age
    foundStudent.grade = req.body.grade
    foundStudent.save()
    .then(res.send(foundStudent))
    .catch(err => {
      console.log(err);
    })
  })
}

exports.deleteStudent = (req, res, next) => {
  let foundStudent = Student.findById(req.params.id, function(err, foundStudent){
    console.log(foundStudent);
    Student.deleteOne({_id: req.params.id})
    .then(res.send(foundStudent))
    .catch(err => {
      console.log(err)
    })
  })
}
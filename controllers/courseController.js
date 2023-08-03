const { Courses } = require("../mongoConfig");

const addCourse = (req) => {
  return Courses.insertOne(req.body);
};

const getAllCourses = (req) => {
  const { page = 1, count = 10 } = req.query; // url?count=30&page=5 
  return Courses.find({})
    .skip((parseInt(page) - 1) * parseInt(count))
    .limit(parseInt(count))
    .sort("title","asc");
};


module.exports = { addCourse, getAllCourses };

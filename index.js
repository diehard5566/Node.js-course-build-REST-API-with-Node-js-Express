const Joi = require('joi');
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: "course1"},
    { id: 2, name: "course2"},
    { id: 3, name: "course3"},
];

app.get('/', (req, res) => {
    res.send("Hello world!!");
});


app.get('/api/courses', (req, res)  => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);//result.error
    if(error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1, 
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    //Look up the courses
    //If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    //validate
    //If invalid, return 400 -Bad request
    const { error } = validateCourse(req.body);//result.error
    if (error) return res.status(400).send(error.details[0].message);

    //Update course
    //Return the updated course
    course.name = req.body.name;
    res.send(course);
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()//告訴Joi name是一個"最少" "需要" (3)個"string"
    });

    return schema.validate(course);
}

app.delete('/api/courses/:id', (req, res) => {
    //Look up the course
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    //Delet
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //Return the same course
    res.send(course);
});


app.get('/api/courses/:id', (req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if (!course) return res.status(404).send('The course with the given ID was not found.');
   res.send(course);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


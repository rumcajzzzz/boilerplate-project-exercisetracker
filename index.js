const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

const users = [];
const exercises = [];

app.post('/api/users', (req, res) => {
  const {username} = req.body;

  if(!username) {
    return res.json({error: 'Username is required.'});    
  }
  
  const newUser = {
    username, 
    _id: (users.length + 1).toString(),
    log: []
  }

  users.push(newUser);
  res.json(newUser);

})

app.get('/api/users', (req, res) => {
  const allUsers = users.map(user => ({
    username: user.username,
    _id: user._id
  }));

  res.json(allUsers);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  let { description, duration, date } = req.body;
  const _id = req.params._id;

  if (!description) return res.json({ error: 'Description is required' });
  if (!duration) return res.json({ error: 'Duration is required' });

  const user = users.find(guy => guy._id === _id);
  if (!user) return res.json({error: 'User not found'});

  const exerciseDate = date ? new Date(date).toDateString() : new Date().toDateString();
 
  const newExercise = {
    description,
    duration: Number(duration),
    date: exerciseDate
  }

  if (!user.log) user.log = [];
  user.log.push(newExercise);

  res.json({
    _id: user._id,
    username: user.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date
  });
});

app.get('/api/users/:_id/logs', (req, res) => {

});
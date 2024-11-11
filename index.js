const express = require('express');
const { resolve } = require('path');
let cors = require('cors');
const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(cors());

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

function add(tasks, taskid, text, priority) {
  tasks.push({
    taskId: taskid,
    text: text,
    priority: priority,
  });
  return tasks;
}
app.get('/tasks/add', (req, res) => {
  let taskid = parseInt(req.query.taskId);
  let text = req.query.text;
  let priority = req.query.priority;
  let result = add(tasks, taskid, text, priority);
  res.send(tasks);
});

//return all tasks

app.get('/tasks', (req, res) => {
  res.send(tasks);
});

//sort by priority
function sortbypriority(tasks1, tasks2) {
  return tasks1.priority - tasks2.priority;
}
app.get('/sort-by-priority', (req, res) => {
  let result = tasks.sort(sortbypriority);
  res.send(result);
});

//update priority
function updatepriority(tasks, taskid, priority) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId == taskid) {
      tasks[i].priority = priority;
    }
  }
  return tasks;
}

app.get('/tasks/edit-priority', (req, res) => {
  let taskid = parseInt(req.query.taskId);
  let priority = req.query.priority;
  let result = updatepriority(tasks, taskid, priority);
  res.json(tasks);
});

//delete a task
function remove(task, taskid) {
  return task.taskId != taskid;
}

app.get('/delete', (req, res) => {
  let taskid = parseInt(req.query.taskId);
  let result = tasks.filter((task) => remove(task, taskid));
  res.send(result);
});

//filter by priority

function prior(task, p) {
  return task.priority === p;
}

app.get('/tasks/filter-by-priority', (req, res) => {
  let p = parseInt(req.query.priority);
  let result = tasks.filter((task) => prior(task, p));
  res.send(result);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

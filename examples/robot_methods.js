var meroboto = require('../lib');

var robot = new meroboto.Robot({name: 'robot-2'})
.after(1000, function(robot) {
  console.log('Hi, my name is ' + robot.name);
})
.after(2000, function(robot) {
  console.log('And yours ?');
})
.on('robot-do', function(robot) {
  console.log('Oh, sorry');
})
.do(function(robot) {
  console.log('I said what');
})
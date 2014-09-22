var meroboto = require('../lib');

var sensor = new meroboto.Sensor({
  timeInterval: 1000, 
  fn: function() {
    return true;
  }
});

var action_1 = new meroboto.Action({
  fn: function(data) {
    console.log('Action 1 receive ' + data + ' and pass false');
    return false;
  }
});

var action_2 = new meroboto.Action({
  fn: function(data) {
    console.log('Action 2 receive ' + data + ' and pass \'robots\'');
    return 'robots'
  }
});

var action_3 = new meroboto.Action({
  fn: function(data) {
    console.log('Action 3 receive and ' + data + ' pass nothing, because is the last action');
  }
});

var stack = new meroboto.Stack()
.push([action_1, action_2, action_3]);

var robot = new meroboto.Robot()
.combine('combine-1', new meroboto.Combine({
  sensor: sensor,
  stack: stack
})); 
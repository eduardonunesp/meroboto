var meroboto = require('../lib');

var sensor = new meroboto.Sensor({
  timeInterval: 1000, 
  fn: function() {
    return Math.floor((Math.random() * 10) + 1);
  }
});

var sensor_2 = new meroboto.Sensor({
  timeInterval: 1000, 
  fn: function() {
    return Math.floor((Math.random() * 20) + 1);
  }
});

var action = new meroboto.Action({
  fn: function(data) {
    if (data > 5)
      console.log('good ' + data);
    else
      console.log('bad ' + data);
  }
});

var robot = new meroboto.Robot()
.combine('combine-1', new meroboto.Combine({
  sensor: sensor, 
  action: action
}))
.combine('combine-2', new meroboto.Combine({
  sensor: sensor_2,
  action: action
}));
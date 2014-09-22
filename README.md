MEROBOTO
=========

A little framework to create a virtual robot, based in sensors and actions.

## Installation

  npm install meroboto --save

## Tests

  npm test
  
## My first robot
The following example it's a simple idea of robot that have a sensor getting random results from some source, then we choose one action to act over the data, to do that we use our first robot to combine both action and sensor.

```
var meroboto = require('meroboto');

var sensor = new meroboto.Sensor({
  timeInterval: 1000, 
  fn: function() {
    return Math.floor((Math.random() * 10) + 1);
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
}));
```

## Release History

* 0.1.0 Initial release
* 0.1.1 Fix bugs
* 0.1.2 Better instatiation and Stacked actions
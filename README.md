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

## Sensors
The sensors are what robots need to know about the world around, even a virtual robot need the sensors. The sensor can optionally have a name, or the name will automatically receive an uuid (v4) as name, but the sensor must be some timer to configure the frequency of the sensor and a function to execute frequently.

```
var sensor = new meroboto.Sensor({
  timeInterval: 1000, // timeInterval and fn are mandatory values
  fn: function() {
    // Every 1000 ms our sensor returns a random value between 1 and 10
    return Math.floor((Math.random() * 10) + 1);
  }
});
```

## Developing a sensor
At this time, i hope that you have thinking about the idea of crafting your own sensor, or find some sensors. Well a sensor isn't so hard to create. You can use pure Javascript or use CoffeeScript (So i do prefer CoffeeScript), take a look in the weather sensor example.

```
meroboto = require 'meroboto'
weather = require 'weather-js'
debug = true if process.env.WEATHER_ROBOT_DEBUG is 'true'

module.exports = 
  class Weather extends meroboto.Sensor
    constructor: (options) ->
      {@name, @timeInterval, @city, @degreeType} = options
      @degreeType ?= 'C'
      super
        name : @name
        timeInterval : @timeInterval

    update: ->
      @lock = true
      conf = 
        search : @city 
        degreeType : @degreeType

      weather.find conf, (err, result) =>
        try
          throw err.toString() if err
          @fn = -> 
            @lock = false
            result[0].current.temperature
        catch error
          @fn false
        finally
          super()
```
The idea of @lock is because sometimes the timerInterval running more fast                             than update, if the lock don't happen the things can run out of control

## Sensor Methods
* .start() : Start the sensor, by default sensors are off
* .stop() : Stop the sensor
* .update() : The methods can be executed manually by the idea ins't that, it's controlled by the robot.

## Sensor Events
* sensor-start : Emitted when the sensor is started by method (start), the sensor object is the parameter.
* sensor-stop : Emitted when the sensor is stopped by method (stop), the sensor object is the parameter.
* sensor-update : Emitted when the sensor is updated by method (update), the sensor object is the parameter.

## Available Sensors
* [meroboto-weather-sensor](https://github.com/eduardonunesp/meroboto-weather-sensor)

## Actions
Actions are so important too, they are the intelligence to work with data that came from the sensors. And actions have two basics parameters: the name, optionally like the sensor's name, and the function to execute, it's important to realize that data in function parameters came from sensor which that action is combined.

```
var action = new meroboto.Action({
  fn: function(data) {
    if (data > 5)
      console.log('good ' + data);
    else
      console.log('bad ' + data);
  }
});
```

## Action Methods
* .execute(args) : As the name said, execute the action, with a parameter, it's imporant to notice here, that method is called by the robot, after combined with the sensor.

## Action Events
* action-executed : Emited when the action is executed, the action object is the parameter.

## Combine
Our glue between actions and sensors, the combine is responsible to execute the sensor and pass the data to action. Basically has three parameters. That are the sensor, the action and stack (don't worry with stack now, will explain soon).

```
var combine = new meroboto.Combine({
  sensor: weatherSensor, 
  action: checkConditions
});
```
Combine has no methods other than the constructor and do not emit events as well.

## Stack
Ok, now we can talk about the stack, the idea is work over many actions one by one, and the results of a action became a parameter of the next action. ([Can You Dig It.](https://www.youtube.com/watch?v=V-OYKd8SVrI)), to clarify more, let me explain by code.

```
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
```
Only the stack can give to our robot that great tool.

## Stack Methods
* push(actions) : Push the action to the bottom of stack (reverse stack), the first action pushed will be the first to be executed.
* .execute(args) : Execute the stack actions, with a parameter, it's imporant to notice here, that method is called by the robot, after combined with the sensor.

## Stack Events
* stack-push : Emitted when the action or array of actions are pushed into the stack, the action object or array of actions are the parameter.
* stack-execute : Emitted when the actions are executed, the actions array are the parameters.

## Robot
The mangager our the container of all actions, sensors and stacks is the robot, the sensors aren't started before they combined into the robot. And the robot have some methods to assist our complement the actions, sometimes it can be useful.

```
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
```

## Robot Methods
* after(timeInterval, function) : A simple callback with timer for a function, the parameter of the callback is the robot itself.
* do(function) : A callback without timer, the parameter of the callback is the robot itself;
* watchSensor(eventName, function) : Watching all sensors by event name, when the event happen executes the callback function, with the sensor as parameter.
* watchAction(eventName, function) : Watching all actions by event name, when the event happen executes the callback function, with the action as parameter.
* combine(alias, combine) : A very important method, the combine receive a alias for the combine and the combine instance. After that the sensor starts and the actions or stack are receiving the sensor data, the combine is running.
* uncombine(alias) : Stop the sensor and remove the combine from robot.
* start(alias) : Starts the combine, by default the combine method already start a Combine.
* stop(alias) : Stops the Combine, by default the uncombine method already do that, but stop do not remove the Combine from Robot.

## Robot Events
* robot-after : Emitted when the timer for after timeout, the robot is the parameter.
* robot-do : Emitted when do executed, the robot is the parameter.
* robot-combine : Emitted when a combine method is called, the Combine object is the parameter.
* robot-uncombine : Emitted when an uncombine method is called, the Combine object is the parameter.
* robot-start : Emitted when start is called, the robot itself is the parameter.
* robot-stop : Emitted when stop is called, the robot itself is the parameter.

## Release History

* 0.1.0 Initial release
* 0.1.1 Fix bugs
* 0.1.2 Better instatiation and Stacked actions
* 0.1.3 
	* New robot events and stack events
	* A decent README
	* Examples
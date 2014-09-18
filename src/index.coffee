util = require 'util'
{EventEmitter} = require 'events'
schedule = require 'node-schedule'

module.exports =
  Schedule : class Schedule
    constructor: (@name, cronRule, fn) ->
      @j = schedule.scheduleJob cronRule, ->
        fn()

  Action : class Action
    constructor: (@name, @fn) ->
    execute: (args) ->
      @fn(args)

  Sensor : class Sensor extends EventEmitter
    constructor: (@name, @timeInterval, @fn) ->

    start: ->
      @intervalHandler = setInterval =>
        @update()
      , @timeInterval
      @emit 'sensor-start', @

    stop: ->
      clearInterval(@intervalHandler);
      @emit 'sensor-stop', @

    update: ->
      @emit 'sensor-update', @

  Combine : class Combine
    constructor: (@sensor, @action) ->
      @sensor.on 'sensor-update', (data) =>
        @action.execute(data.fn())

  Robot : class Robot extends EventEmitter
    constructor: (@name) ->
      @sensors = {}
      @actions = {}
      @combines = []

    after: (timeInterval, fn) ->
      setTimeout =>
        fn(@)
      , timeInterval

    do: (fn) ->
      fn()

    waitEvent: (eventName, fn) ->
      for name, sensor of @sensors
        sensor.on eventName, (data) ->
          fn(data)

    combine: (sensor, action) ->
      @combines.push new Combine(sensor, action)
      @addSensor(sensor)
      @addAction(action)

    addAction: (action) ->
      @actions[action.name] = action
      @emit 'add-action', action

    removeAction: (action) ->
      delete @actions[action.name]
      @emit 'remove-action'

    addSensor: (sensor) ->
      @sensors[sensor.name] = sensor
      sensor.start()
      @emit 'add-sensor', sensor

    removeSensor: (sensor) ->
      delete @sensor[sensor.name]
      sensor.stop()
      @emit 'remove-sensor'
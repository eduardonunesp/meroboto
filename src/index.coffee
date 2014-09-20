util = require 'util'
{EventEmitter} = require 'events'

module.exports =
  Action : class Action extends EventEmitter
    constructor: (@name, @fn) ->
    execute: (args) ->
      @emit 'action-executed', @
      @fn(args)

  Sensor : class Sensor extends EventEmitter
    constructor: (@name, @timeInterval, @fn) ->
      @lock = false

    start: ->
      @intervalHandler = setInterval =>
        if not @lock
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

    waitSensorEvent: (eventName, fn) ->
      for name, sensor of @sensors
        sensor.on eventName, (data) ->
          fn(data)

    waitActionEvent: (actionName, fn) ->
      for name, action of @actions
        action.on actionName, (data) ->
          fn(data)

    combine: (sensor, action) ->
      combo = new Combine(sensor, action)
      @combines.push combo
      @__addSensor(sensor)
      @__addAction(action)
      @emit 'robot-combine'
          , sensor:sensor
          , action:action
      return combo

    disassociate: (combine) ->
      @__removeAction(combine.action)
      @__removeSensor(combine.sensor)
      idx = @combines.indexOf combine
      @combines.splice idx, 1
      @emit 'robot-disassociate'
          , sensor:combine.sensor
          , action:combine.action

    __addAction: (action) ->
      @actions[action.name] = action

    __removeAction: (action) ->
      delete @actions[action.name]

    __addSensor: (sensor) ->
      @sensors[sensor.name] = sensor
      sensor.start()

    __removeSensor: (sensor) ->
      delete @sensors[sensor.name]
      sensor.stop()
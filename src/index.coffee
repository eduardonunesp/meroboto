util = require 'util'
{EventEmitter} = require 'events'

module.exports =
  Action : class Action
    constructor: (@name, @fn) ->
    execute: (args) ->
      @fn(args)

  Sensor : class Sensor extends EventEmitter
    constructor: (@name, @timeInterval) ->

    start: ->
      @intervalHandler = setInterval =>
        @update()
      , @timeInterval
      @emit 'start', @name

    stop: ->
      clearInterval(@intervalHandler);
      @emit 'stop', @name

    update: ->
      @emit 'update', true, false

  Combine : class Combine
    constructor: (@sensor, @action) ->
      @sensor.on 'update', (data) =>
        @action.execute(data)

  Robot : class Robot extends EventEmitter
    constructor: (@name) ->
      @sensors = {}
      @actions = {}
      @combines = []

    combine: (sensor, action) ->
      @combines.push new Combine(sensor, action)
      @addSensor(sensor)
      @addAction(action)

    addAction: (action) ->
      @actions[action.name] = action
      @emit 'add-action', action

    removeActoin: (action) ->
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

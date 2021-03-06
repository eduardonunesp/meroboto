util = require 'util'
uuid = require 'uuid'
{EventEmitter} = require 'events'
{HashMap} = require 'hashmap'

module.exports =
  Action : class Action extends EventEmitter
    constructor: (options) ->
      {@name, @fn} = options; 
      @name ?= uuid.v4(); @

    execute: (args) ->
      @emit 'action-executed', @
      @fn(args); @

  Stack : class Stack extends EventEmitter
    constructor: (options = {}) ->
      {@name} = options
      @name ?= uuid.v4()
      @actions = []; @

    push: (actions) ->
      if util.isArray actions
        for action in actions
          @actions.push(action)
      else
        @actions.push(actions)
      @emit 'stack-push', actions; @

    execute: (args) ->
      ret = null
      for action in @actions
        ret ?= args
        ret = action.fn(ret);
      @emit 'stack-execute', @actions; @

  Sensor : class Sensor extends EventEmitter
    constructor: (options) ->
      {@name, @timeInterval, @fn} = options
      @name ?= uuid.v4()
      @lock = false; @

    start: ->
      @intervalHandler = setInterval =>
        if not @lock
          @update()
      , @timeInterval
      @emit 'sensor-start', @; @

    stop: ->
      clearInterval(@intervalHandler);
      @emit 'sensor-stop', @; @

    update: ->
      @emit 'sensor-update', @; @

  Combine : class Combine
    constructor: (options) ->
      {@sensor, @action, @stack} = options

      if @action?
        @sensor.on 'sensor-update', (data) =>
          @action.execute(data.fn())

      if @stack?
        @sensor.on 'sensor-update', (data) =>
          @stack.execute(data.fn())

  Robot : class Robot extends EventEmitter
    constructor: (options = {}) ->
      {@name} = options
      @name ?= uuid.v4()
      @combines = new HashMap(); @

    after: (timeInterval, fn) ->
      setTimeout =>
        fn(@)
      , timeInterval; 
      @emit 'robot-after', @; @

    do: (fn) ->
      fn(@); 
      @emit 'robot-do', @; @

    watchSensor: (eventName, fn) ->
      for name, sensor of @sensors
        sensor.on eventName, (data) ->
          fn(data)
      return @
    
    watchAction: (eventName, fn) ->
      for name, action of @actions
        action.on eventName, (data) ->
          fn(data)
      return @

    combine: (alias, combine) ->
      combine.sensor.start()
      @combines.set alias, combine
      @emit 'robot-combine', combine, @; @

    uncombine: (alias) ->
      combine = @combines.get alias

      if not combine
        throw Error 'Alias don\'t exists'

      combine.sensor.stop()
      @combines.remove alias
      @emit 'robot-uncombine', combine, @; @

    start: (alias) ->
      combine = @combines.get alias

      if not combine
        throw Error 'Alias don\'t exists'

      combine.sensor.start()
      @emit 'robot-start', combine, @; @

    stop: (alias) ->
      combine = @combines.get alias

      if not combine
        throw Error 'Alias don\'t exists'

      combine.sensor.stop()
      @emit 'robot-stop', @; @
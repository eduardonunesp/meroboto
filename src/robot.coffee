util = require 'util'
{EventEmitter} = require 'events'

module.exports =
  class Robot extends EventEmitter
    constructor: (@name, @updateInterval) ->
      @emit 'loaded'
          , name : @name
          , updateInterval : @updateInterval

      setInterval ->
        @updateLoop
      , @updateInterval

    updateLoop: ->
      util.log 'update'
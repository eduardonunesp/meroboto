var assert = require('assert')
  , meroboto = require('../lib/');

describe('Meroboto Lab Test, BIP!', function(){
  describe('Basic Test', function(){
    it('Should turn on', function(done){
      var robot = new meroboto.Robot({
        name: 'robot-1'
      });

      assert.equal(robot.name, 'robot-1');
      done();
    });

    it('Should run after timeout', function(done) {
      this.timeout(20);
      var robot = new meroboto.Robot('robot-2')
      .after(10, function(r) {
        var rxp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        assert.equal(rxp.test(r.name), true);
        done();
      });
    });

    it('Should run without name', function(done) {
      this.timeout(20);
      var robot = new meroboto.Robot()
      .after(10, function(r) {
        var rxp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        assert.equal(rxp.test(r.name), true);
        done();
      });
    });

    it('Should test create sensor', function(done) {
      var sensor = new meroboto.Sensor({
        name: 'sensor',
        timeInterval: 100,
        fn: function() {}
      })
      .on('sensor-start', function() {})
      .on('sensor-update', function() {
        sensor.stop();
        done();
      })
      .start();
    });

    it('Should test create action', function(done) {
      var action = new meroboto.Action({
        name: 'action1', 
        fn: function(data) {
          assert.equal(data, true);
          done();
        }
      }).execute(true);
    });

    it('Should combine sensor and action', function(done) {
      var sensor = new meroboto.Sensor({
        name: 'sensor-1', 
        timeInterval: 10, 
        fn: function() {
          return true;
        }
      });

      var action = new meroboto.Action({
        name: 'action-1', 
        fn: function(data) {
          assert.equal(data, true);
          sensor.stop();
          done();
        }
      });

      var robot = new meroboto.Robot()
      .combine('combine-1', new meroboto.Combine({
        sensor: sensor,
        action: action
      }));
    });

    it('Should combine sensor and stack', function(done) {
      var sensor = new meroboto.Sensor({
        name: 'sensor-1', 
        timeInterval: 1000, 
        fn: function() {
          return true;
        }
      });

      var stack = new meroboto.Stack({
        name: 'stack-1',
      });

      var action_1 = new meroboto.Action({
        name: 'action-1', 
        fn: function(data) {
          assert.equal(data, true);
          return false;
        }
      });

      var action_2 = new meroboto.Action({
        name: 'action-2', 
        fn: function(data) {
          assert.equal(data, false);
          return 'robots'
        }
      });

      var action_3 = new meroboto.Action({
        name: 'action-3', 
        fn: function(data) {
          assert.equal(data, 'robots');
          sensor.stop();
          done();
        }
      });

      stack.push([action_1, action_2, action_3]);

      var combine = new meroboto.Combine({
        sensor: sensor,
        stack: stack
      });

      var robot = new meroboto.Robot()
      .combine('combine-1', combine);
    });

    it('Should throw error if alias do not exists', function(done) {
      try {
        var robot = new meroboto.Robot()
        .start('do-not-exists');
      } catch(e) {
        done();
      }
    });

    it('Should wait for sensor event', function(done) {
      var robot = new meroboto.Robot()
      .watchSensor('sensor-update', function() {
        done();
      });

      var sensor = new meroboto.Sensor({
        timeInterval: 100, 
        fn: function() {
          return true;
        }
      });

      var action = new meroboto.Action({
        fn: function(data) {
          assert.equal(data, true);
          sensor.stop();
          done();
        }
      }).execute(true);
    });

    it('Should wait for action event', function(done) {
      var robot = new meroboto.Robot()
      .watchAction('action-executed', function() {
        done();
      });

      var sensor = new meroboto.Sensor({
        timeInterval: 100, 
        fn: function() {
          return true;
        }
      });

      var action = new meroboto.Action({
        fn: function(data) {
          assert.equal(data, true);
          sensor.stop();
          done();
        }
      }).execute(true);
    });

    it('Should disassociate sensor and action', function(done) {
      var sensor = new meroboto.Sensor({
        timeInterval: 100, 
        fn: function() {
          return true;
        }
      });

      var action = new meroboto.Action({
        fn: function(data) {
          assert.equal(data, true);
          sensor.stop();
        }
      });
      
      var combine = new meroboto.Combine({
        sensor: sensor,
        action: action
      });

      var robot = new meroboto.Robot()
      .on('robot-uncombine', function() {done(); })
      .combine('combo-2', combine)
      .stop('combo-2')
      .uncombine('combo-2');
    });

    it('Should disassociate sensor and stack', function(done) {
      var sensor = new meroboto.Sensor({
        name: 'sensor-1', 
        timeInterval: 1000, 
        fn: function() {
          return true;
        }
      });

      var stack = new meroboto.Stack({
        name: 'stack-1',
      });

      var action_1 = new meroboto.Action({
        name: 'action-1', 
        fn: function(data) {
          assert.equal(data, true);
          return false;
        }
      });

      var action_2 = new meroboto.Action({
        name: 'action-2', 
        fn: function(data) {
          assert.equal(data, false);
          return 'robots'
        }
      });

      var action_3 = new meroboto.Action({
        name: 'action-3', 
        fn: function(data) {
          assert.equal(data, 'robots');
        }
      });

      stack.push([action_1, action_2, action_3]);

      var combine = new meroboto.Combine({
        sensor: sensor,
        stack: stack
      });

      var robot = new meroboto.Robot()
      .on('robot-uncombine', function(combine, robot) {
        done(); 
      })
      .combine('combine-1', combine)
      .stop('combine-1')
      .uncombine('combine-1');
    });
  })
})
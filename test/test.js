var assert = require('assert')
  , meroboto = require('../lib/');

describe('Meroboto Lab Test, BIP!', function(){
  describe('Basic Test', function(){
    it('Should turn on', function(done){
      var robot = new meroboto.Robot('robot-1');
      assert.equal(robot.name, 'robot-1');
      done();
    });

    it('Should test after timer', function(done) {
      this.timeout(20);
      var robot = new meroboto.Robot('robot-2');
      robot.after(10, function(r) {
        assert.equal(r.name, 'robot-2');
        done();
      });
    });

    it('Should test create sensor', function(done) {
      var sensor = new meroboto.Sensor('sensor', 100, function() {});
      sensor.on('sensor-start', function() {
        sensor.stop();
        done();
      })
      sensor.start();
    });

    it('Should test create action', function(done) {
      var action = new meroboto.Action('action1', function(data) {
          assert.equal(data, true);
          done();
      });
      action.execute(true);
    });

    it('Should combine sensor and action', function(done) {
      var robot = new meroboto.Robot('robot-3');
      var sensor = new meroboto.Sensor('sensor-1', 10, function() {
        return true;
      });
      var action = new meroboto.Action('action-1', function(data) {
          assert.equal(data, true);
          sensor.stop();
          done();
      });
      robot.combine(sensor, action)
    });

    it('Should wait for sensor event', function(done) {
      var robot = new meroboto.Robot('robot-4');
      robot.waitSensorEvent('sensor-update', function() {
        done();
      });

      var sensor = new meroboto.Sensor('sensor-2', 100, function() {
        return true;
      });
      var action = new meroboto.Action('action-2', function(data) {
          assert.equal(data, true);
          sensor.stop();
          done();
      });
      action.execute(true);
    });

    it('Should wait for action event', function(done) {
      var robot = new meroboto.Robot('robot-4');
      robot.waitActionEvent('action-executed', function() {
        done();
      });

      var sensor = new meroboto.Sensor('sensor-2', 100, function() {
        return true;
      });
      var action = new meroboto.Action('action-2', function(data) {
          assert.equal(data, true);
          sensor.stop();
          done();
      });
      action.execute(true);
    });

    it('Should disassociate sensor and action', function(done) {
      var robot = new meroboto.Robot('robot-5');
      //robot.on('robot-disassociate', function() {
      //  done();
      //});

      var sensor = new meroboto.Sensor('sensor-3', 100, function() {
        return true;
      });
      var action = new meroboto.Action('action-3', function(data) {
          assert.equal(data, true);
          sensor.stop();
      });
      
      combo = robot.combine(sensor, action)
      robot.disassociate(combo);
      done();
    });
  })
})
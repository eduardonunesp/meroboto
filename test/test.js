var assert = require('assert')
  , meroboto = require('../lib/');

describe('Meroboto Lab Test, BIP!', function(){
  describe('Basic Test', function(){
    it('Should turn on', function(done){
      var robot = new meroboto.Robot('robot-1');
      assert.equal(robot.name, 'robot-1');
      done();
    });

    it('Shoult test after timer', function(done) {
      var robot = new meroboto.Robot('robot-2');
      robot.after(1000, function(r) {
        assert.equal(r.name, 'robot-2');
        done();
      });
    });
  })
})
const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('POST request to /api/solve', () => {
    
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, '812753649943682175675491283154237896369845721287169534521974368438526917796318452');
          done();
        });
    });
  
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: '' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });
  
    test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
      chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: '8..........A6......7..9.2...5...7....B..457.....1...3...1.C..68..85...1..9....4..' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
    });
  
    test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4.' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
      chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send( {puzzle: '123..........4..........4...5.3.....4...6..19..1.......7..5.........6.9.6..9...21' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
    });

  });

  suite('POST request to /api/check', () => {
    
    test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
      const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'A6', value: '3' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
      const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'A6', value: '7' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 1);
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'A1', value: '1' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isAbove(res.body.conflict.length, 1);
          done();
        });
    });

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'A1', value: '5' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 3)
          done();
        });
    });

    test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: '', coordinate: 'A1', value: '5' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
      const puzzle = 'A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'A1', value: '1' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.';
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'A1', value: '1' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'A10', value: '1' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'A1', value: '10' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });

  });

});

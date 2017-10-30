var request = require('request');
var fs = require('fs');
var expect = require('chai').expect;
var dg = require('../dataGenerator.js');

describe('server', function() {

    var data = {
        user_id: 56204548,
        views: 76,
        sessions: 499,
        average: 0.1523046092184369,
        array: [94.86224140336374, 86.63354378662851, 104.42415952157596, 122.66947030651974,
            93.50414963003051, 123.40744417208187, 91.14255364044595, 88.36637359217123, 104.48689206245085,
            126.52510246979593, 144.76877750354365, 113.41604660159874, 100.4241781156259, 91.66991485562892,
            116.28990193301121, 77.50048846738024, 97.69005907571075, 86.10307901567063, 116.38477091427174,
            98.87950875423937, 117.50503704442319, 89.89857279411889, 101.25359512509276, 96.9903639065386,
            115.19517367277446, 105.71962265440055, 106.70912414024617, 111.45617869231855, 102.83500986077439, 
            112.73042801969608, 101.59694179032472, 85.74569501318338, 98.78345241942885, 87.93166074550835,
            95.70693889552977, 99.15737222438672, 98.98326892462393, 97.6525612666725, 92.84704492130057,  
            98.39768917036092, 87.78582747893968, 88.76697816953828, 111.9296674216904, 109.82184024380373, 
            84.95772155567536, 100.6638981900513, 116.50124077781588, 116.46004985613243,  110.15969968697277, 
            91.545222094611, 90.72608990482966, 115.41347260867819
        ]
    }
        
    describe('analyzer service server', function() {
        // If you are getting a timeout error here, what does that mean?
        it('Should respond', function(done) {
        request('http://127.0.0.1:8080/', function(error, response, body) {
            // If you are getting a connection refused error here, what does that mean?
            expect(error).to.not.exist;
            done();
        });
        });
    });

    describe('makeRandom function', function() {
        it('should generate an object', function(done) {
            expect(dg.makeRandom()).to.be.an('object');
            done();
        });
    });

    describe('userPacket function', function() {
        it('should generate an object', function(done) {
            expect(dg.userPacket(data)).to.be.an('object');
            done();
        });
    });

    describe('indicatorPacket function', function() {
        it('should generate an object', function(done) {
            expect(dg.indicatorPacket(data)).to.be.an('object');
            done();
        });
    });

});
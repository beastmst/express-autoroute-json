/* jshint expr: true */
//setup
var autoroute = require('express-autoroute');
var expect = require('chai').expect;
var express = require('express');
var http = require('http');

var path = require('path');
var request = require('supertest');
var Q = require('q');

var fixture = require('./fixtures/loadData');

var app;
var server;

describe('the create block', function () {
    beforeEach(function() {
        //reset app
        app = express();
        server = http.createServer(app);
        return Q.ninvoke(server, 'listen', 255255).then(function() {
            return fixture.init();
        });
    });

    afterEach(function (done) {
        fixture.reset();
        server.close(done);
    });

    it('should return status 201 if create exists', function (done) {
        autoroute(app, {
            throwErrors: true,
            routesDir: path.join(process.cwd(), "test", "fixtures", "create")
        });

        request(app).post('/chats', {name: "name", count: 0}).expect(201).end(function(err, response){
            expect(err).to.not.be.ok;
            expect(response.body._id).to.not.be.empty;
            done();
        });
    });

    it('should be able to retrieve the created resource', function (done) {
        autoroute(app, {
            throwErrors: true,
            routesDir: path.join(process.cwd(), "test", "fixtures", "create")
        });

        request(app).post('/chats', {name: "name", count: 0}).end(function(err, postResponse){
            expect(err).to.not.be.ok;
            request(app).get('/chats/' + postResponse.body._id).expect(200).end(function(err, getResponse){
                expect(err).to.not.be.ok;
                expect(postResponse.body._id).to.equal(getResponse.body._id);
                done();
            });
        });
    });
});

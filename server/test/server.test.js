/* eslint-env node, mocha */
import expect from 'expect';
import request from 'supertest';
import app from '../index';
import db from '../db';

describe('/candidates', () => {
    it('GET /candidates => list of candidates', (done) => {
        request(app)
            .get('/candidates')
            .expect('Content-Type', /json/)
            .expect(200, db.candidates)
            .end(done);
    });
    it('GET /candidates/id => single candidate', (done) => {
        request(app)
            .get('/candidates/1')
            .expect('Content-Type', /json/)
            .expect(200, db.candidates[0])
            .end(done);
    });
    it('POST /candidates => create new candidate', (done) => {
        request(app)
            .post('/candidates')
            .send({ name: 'My Candidate' })
            .expect(res => {
                expect(res.body.name).toEqual('My Candidate');
                expect(res.body.id).toEqual(3);
            })
            .end(done);
    });
    it('PUT /candidates/1 => should not update hillary', (done) => {
        request(app)
            .put('/candidates/1')
            .send({ name: 'New Hillary' })
            .expect(res => {
                expect(res.status).toEqual(403);
            })
            .end(done);
    });
    it('DELETE /candidates/1 => should not delete hillary', (done) => {
        request(app)
            .delete('/candidates/1')
            .expect(res => {
                expect(res.status).toEqual(403);
            })
            .end(done);
    });
});

describe('/votes', () => {
    it('GET /votes => list of votes', (done) => {
        request(app)
            .get('/votes')
            .expect('Content-Type', /json/)
            .expect(200, db.votes)
            .end(done);
    });
    it('GET /votes/id => single vote', (done) => {
        request(app)
            .get('/votes/1')
            .expect('Content-Type', /json/)
            .expect(200, db.votes[0])
            .end(done);
    });
    it('POST /votes => valid vote cast', (done) => {
        request(app)
            .post('/votes')
            .send({ candidateId: 2 })
            .expect(201)
            .expect(res => {
                expect(res.body.id).toExist();
                expect(res.body.candidateId).toEqual(2);
            })
            .end(done);
    });
    it('POST /votes => missing candidateId', (done) => {
        request(app)
            .post('/votes')
            .send({ })
            .expect(500, {
                message: 'Invalid vote, missing required fields (candidateId, voterId)',
                success: false
            })
            .end(done);
    });
    it('POST /votes => missing candidateId', (done) => {
        request(app)
            .post('/votes')
            .send({ })
            .expect(500, {
                message: 'Invalid vote, missing required fields (candidateId, voterId)',
                success: false
            })
            .end(done);
    });
    it('POST /votes => bad candidateId', (done) => {
        request(app)
            .post('/votes')
            .send({ candidateId: 1000 })
            .expect(500, {
                message: 'Invalid vote, missing required fields (candidateId, voterId)',
                success: false
            })
            .end(done);
    });
    it('PUT /votes/1 => should not update votes', (done) => {
        request(app)
            .put('/votes/1')
            .send({ candidateId: 1000 })
            .expect(res => {
                expect(res.status).toEqual(403);
            })
            .end(done);
    });
    it('DELETE /votes/1 => should not delete votes', (done) => {
        request(app)
            .delete('/votes/1')
            .expect(res => {
                expect(res.status).toEqual(403);
            })
            .end(done);
    });
});

describe('/summary', () => {
    it('GET /summary => list of candidates and their vote counts', (done) => {
        request(app)
            .get('/summary')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body.candidateScores).toEqual({ '1': 2, '2': 4 });
                expect(res.body.winningCandidate.name).toEqual('Donald Trump');
            })
            .end(done);
    });
});


const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeThoughtsArray } = require('./thoughts-fixtures')

describe('Thoughts Endpoints', function() {
  let db 

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })
  

  after('disconnect from db', ()  => db.destroy())

  before('clean the table', () => db('music_thoughts').truncate())

  afterEach('cleanup', () => db('music_thoughts').truncate())

  
describe(`GET /api/thoughts`, () => {
  context(`Given no thoughts`, () => {
    it(`responds with 200 and an empty board`, () => {
      return supertest(app)
      .get('/api/thoughts')
      .expect(200, [])
    })
  })
})

  describe(`GET /api/thoughts`, () => { 
  context('Given there are thoughts in the database', () => {
    const testThoughts = makeThoughtsArray()
    beforeEach('insert thoughts', () => {
      return db 
      .into('music_thoughts')
      .insert(testThoughts)
      
    })

    it('GET /thoughts responds with 200 and all of the thoughts', () => {
      return supertest(app)
      .get('/api/thoughts')
      .expect(200, testThoughts)
      
    })
  })

   describe(`POST/api/thoughts`, () => {
       it(`creates an thought, responding with 201 and the new thoughts`,  function() {
        this.retries(3)
        const newThought = {
          title: 'Test new thought',
          tag: 'rock', 
          content: 'Test new test content'} 
        return supertest(app)
           .post('/api/thoughts')
           .send(newThought)
           .expect(201)
           .expect(res => {
             expect(res.body.title).to.eql(newThought.title)
             expect(res.body.tag).to.eql(newThought.tag)
             expect(res.body.content).to.eql(newThought.content)
             expect(res.body).to.have.property('id')
             expect(res.headers.location).to.eql(`/api/thoughts/${res.body.id}`)
             const expected = new Date().toLocaleString()
             const actual = new Date(res.body.date_published)
             expect(actual).to.eql(expected)
           })
           .then(postRes => 
            supertest(app)
            .get(`api/thoughts/${postRes.body.id}`)
            .expect(postRes.body))
       })
       it(`responds with 400 and an error message when the title is missing`, () => {
         return supertest(app)
         .post('/api/thoughts')
         .send({
           tag: 'testTag',
           content: 'testContent',
         })
         .expect(400, {
           error: {message: `Missing title in request body`}
         })
       })
       it(`responds with 400 and an error message when the content is missing`, () => {
        return supertest(app)
        .post('/api/thoughts')
        .send({
          title: 'testTitle',
          tag: 'testTag',
        })
        .expect(400, {
          error: {message: `Missing content in request body`}
        })
      })
      it(`responds with 400 and an error message when the tag is missing`, () => {
        return supertest(app)
        .post('/api/thoughts')
        .send({
          title: 'testTitle',
          content: 'testContent',
        })
        .expect(400, {
          error: {message: `Missing tag in request body`}
        })
      })
     })
    })
  

  describe(`GET /api/thoughts/thoughts_id`, () => {
    context('Given there are thought in the database', () => {
      const testThoughts = makeThoughtsArray()

      beforeEach('insert thoughts', () => {
        return db
        .into('music_thoughts')
        .insert(testThoughts)
      })
    
    it('GET /api/thoughts/:thought_id responds with 200 and the specific thought', () => {
      const thoughtID = 2
      const expectedThought = testThoughts[thoughtID - 1]
      return supertest(app)
      .get(`/api/thoughts/${thoughtID}`)
      .expect(200, expectedThought)
    })
  })
})

  describe(`DELETE /api/thoughts/:thoughts_id`, () => {
      context('Given there are no thoughts in the database', () => {
        it('responds with 404', () => {
          const thoughtID = 123456
          return supertest(app)
          .delete(`/api/thoughts/${thoughtID}`)
          .expect(404, {error: {message: `Thought doesn't exist`}})
        })
      })

  context('Given there are thoughts in the database', () => {
    const testThoughts = makeThoughtsArray()
    beforeEach('insert thoughts in the database', () => {
      return db
      .into('music_thoughts')
      .insert(testThoughts)
    })

    it('responds with 204 and removes the thought', () => {
      const idToRemove = 2 
      const expectedThoughts = testThoughts.filter(thought => thought.id !== idToRemove)
        return supertest(app)
        .delete(`/api/thoughts/${idToRemove}`)
        .expect(204)
        .then(res =>
           supertest(app)
          .get('/api/thoughts')
          .expect(expectedThoughts)
          )
        })
      })
    })

    describe(`PATCH /api/thoughts/:thoughts_id`, () => {
      context(`Given no thoughts`, () => {
        it(`responds with 404`, () => {
          const thoughtId = 123456
          return supertest(app)
            .delete(`/api/thoughts/${thoughtId}`)
            .expect(404, { error: { message: `Thought doesn't exist` } })
        })
      })
  
      context('Given there are thoughts in the database', () => {
        const testthoughts = makeThoughtsArray()
  
        beforeEach('insert thoughts', () => {
          return db
            .into('music_thoughts')
            .insert(testthoughts)
        })
  
        it('responds with 204 and updates the thought', () => {
          const idToUpdate = 2
          const updatethought = {
            title: 'updated thought title',
            content: 'updated thought content',
            tag: 'rock',
          }
          const expectedthought = {
            ...testthoughts[idToUpdate - 1],
            ...updatethought
          }
          return supertest(app)
            .patch(`/api/thoughts/${idToUpdate}`)
            .send(updatethought)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/thoughts/${idToUpdate}`)
                .expect(expectedthought)
            )
        })
  
        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 2
          return supertest(app)
            .patch(`/api/thoughts/${idToUpdate}`)
            .send({ irrelevantField: 'foo' })
            .expect(400, {
              error: {
                message: `Request body must contain either 'title', 'tag' or 'content'`
              }
            })
        })
  
        it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 2
          const updatethought = {
            title: 'updated thought title',
          }
          const expectedthought = {
            ...testthoughts[idToUpdate - 1],
            ...updatethought
          }
  
          return supertest(app)
            .patch(`/api/thoughts/${idToUpdate}`)
            .send({
              ...updatethought,
              fieldToIgnore: 'should not be in GET response'
            })
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/thoughts/${idToUpdate}`)
                .expect(expectedthought)
            )
        })
      })
    })
  })
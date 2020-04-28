const path = require('path')
const express = require('express')
const ThoughtsService = require('./thoughts-services')
const CommentsService = require('../musicthoughtscomments/comments-service')

const thoughtsRouter = express.Router()
const jsonParser = express.json()


thoughtsRouter
.route('/')
.get((req,res,next) => {
ThoughtsService.getAllThoughts(
  req.app.get('db')
)
.then(thoughts=>{
  res.json(thoughts)
})
.catch(next)
})

.post(jsonParser, (req, res, next) => {
  const {title, content, tag} = req.body
  const newThought = { title, content, tag }
  if(!title) {
    return res.status(400).json({
      error: { message: `Missing title in request body`}
    })
  }
  if(!content) {
    return res.status(400).json({
      error: { message: `Missing content in request body`}
    })
  }
  if(!tag) {
    return res.status(400).json({
      error: { message: `Missing tag in request body`}
    })
  }
  ThoughtsService.insertThoughts(
    req.app.get('db'),
    newThought
  )
  .then(thought => {
    res.status(201)
    .location(path.posix.join(req.originalUrl, `/${thought.id}`))
    .json(thought)
  })
  .catch(next)
})

thoughtsRouter
.route('/:thoughts_id/comments')
.get((req,res,next) => {
ThoughtsService.getCommentsByID(
  req.app.get('db'),
  req.params.thoughts_id
)
.then(thoughts=>{
  res.json(thoughts)
})
.catch(next)
})

thoughtsRouter
.route('/:thoughts_id')
.all((req, res, next) => {
  ThoughtsService.getbyID(
    req.app.get('db'),
    req.params.thoughts_id
  )
.then(thought => {
  if(!thought) {
    return res.status(404).json({
      error: {message: `Thought doesn't exist`}
    })
  }
  res.thoughts = thought
  next()
})
.catch(next)
})
.get((req,res,next) => {
  res.json({
    id: res.thoughts.id,
    content: res.thoughts.content,
    tag: res.thoughts.tag,
    title: res.thoughts.title,
    date_published: res.thoughts.date_published,
    likes: res.thoughts.likes,
  })
.catch(next)
})

.delete((req, res, next) => {
  ThoughtsService.deleteThoughts(
    req.app.get('db'),
    req.params.thoughts_id
  )
  .then(() => {
    res.status(204).end()
  })
  .catch(next)
}
)

.patch(jsonParser, (req, res, next) => {
  const {title, content, tag} = req.body
  const thoughtToUpdate = {title, content, tag}
  const numberOfValues = Object.values(thoughtToUpdate).filter(Boolean).length
  if(numberOfValues === 0) {
    return res.status(400).json({
      error: {message: `Request body must contain either 'title', 'tag' or 'content'`}
    })
  }
  ThoughtsService.updateThoughts(
    req.app.get('db'),
    req.params.thoughts_id,
    thoughtToUpdate
  )

 
    .then(newRowsAffected => {
    res.status(204).end()
  })
  .catch(next)
})



module.exports = thoughtsRouter
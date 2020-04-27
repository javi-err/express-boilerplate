const CommentsService = {

  getById(db, id) {
    return db
      .from('music_thoughts_comments AS comm')
      .select(
        'comm.id',
        'comm.thought_text',
        'comm.date_created',
        'comm.thought_id',
      )      .where('comm.id', id)
      .first()
  },

insertComment(db, newComment) {
  return db
    .insert(newComment)
    .into('music_thoughts_comments')
    .returning('*')
    .then(([comment]) => comment)
    .then(comment =>
      CommentsService.getById(db, comment.id)
    )
},


serializeComment(comment) {
  return {
    id: comment.id,
    thought_text: comment.thought_text,
    thought_id: comment.thought_id,
  }
}
}

module.exports = CommentsService
const ThoughtsService = {
  getAllThoughts(knex) {
    return knex.select('*').from('music_thoughts')
  },
insertThoughts(knex, newThoughts) {
  return knex
  .insert(newThoughts)
  .into('music_thoughts')
  .returning('*')
  .then(rows => {
    return rows[0]
  })
},
getbyID(knex, id) {
  return knex.from('music_thoughts')
  .select('*')
  .where('id', id)
  .first()
},
deleteThoughts(knex, id) {
  return knex('music_thoughts')
  .where({id})
  .delete()
},
updateThoughts(knex, id, newThoughtFields) {
  return knex('music_thoughts')
  .where({id})
  .update(newThoughtFields)
},

getCommentsByID(knex, id) {
  return knex
  .select("comment.thought_text", "comment.id")
  .from("music_thoughts")
  .where("music_thoughts.id", id)
  .rightJoin(
    "music_thoughts_comments as comment",
    "comment.thought_id ",
    "music_thoughts.id"
  )
  .returning("thought_text");
},
}

module.exports = ThoughtsService
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
}

module.exports = ThoughtsService
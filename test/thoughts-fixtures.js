function makeThoughtsArray() {
  return [
    {
      id: 1,
      date_published: '2029-01-22T16:28:32.615Z',
      title: 'First test post!',
      content: 'Lorem ipsum',
      tag: 'Rock',
      likes: 3,
    },

    {
      id: 2,
      date_published: '2029-01-22T16:28:32.615Z',
      title: 'First test post!',
      content: 'Lorem ipsum',
      tag: 'Blues',
      likes: 3,
    },

    {
      id: 3,
      date_published: '2029-01-22T16:28:32.615Z',
      title: 'Third test post!',
      content: 'Lorem ipsum dolem',
      tag: 'Rap',
      likes: 20,
    }
  ]
}

module.exports = {
  makeThoughtsArray,
}
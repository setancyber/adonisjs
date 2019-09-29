'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GuestSchema extends Schema {
  up () {
    this.collection('guests', (collection) => {
      collection.index('email_index', {email: 1}, {unique: true})
    })
  }

  down () {
    this.drop('guests')
  }
}

module.exports = GuestSchema

'use strict'

/*
|--------------------------------------------------------------------------
| GuestSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Guest = use('App/Models/Guest')

class GuestSeeder {
  async run () {
    await Guest.query().delete()

    await Factory
      .model('App/Models/Guest')
      .createMany(50)
  }
}

module.exports = GuestSeeder

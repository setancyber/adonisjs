'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/Guest', (faker) => {
  return {
    first_name: faker.first(),
    last_name: faker.last(),
    email: faker.email(),
    contact: faker.phone(),
    address: faker.address()
  }
})

Factory.blueprint('App/Models/User', (faker) => {
  return {
    email: 'hello@mail.com',
    password: '12345',
    name: faker.name()
  }
})

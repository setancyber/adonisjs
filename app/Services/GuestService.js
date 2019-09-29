'use strict'

const Guest = use('App/Models/Guest')
const _ = use('lodash')

class GuestService {
	async fetch(page = 1, limit = 10) {
		/* make sure page value is a corect integer */
		if(Number.isInteger(page) == false || parseInt(page) <= 0){
      		page = 1
		}

		/* make sure limit value is a corect integer */
		if(Number.isInteger(limit) == false || parseInt(limit) <= 0){
			limit = 10
		}
		
		return await Guest.query()
						  .orderBy('created_at', 'desc')
						  .paginate(page, limit)
	}

	async store({ first_name, last_name, email, address, contact }) {
		const guest = new Guest()

		guest.fill({
			first_name,
			last_name,
			email,
			address,
			contact
		})

		await guest.save()

		return guest
	}

	async find(id) {
		const guest = await Guest.findOrFail(id)

		return guest
	}

	async update({ first_name, last_name, email, address, contact }, id) {
		const guest = await Guest.findOrFail(id)
		const values = _.pickBy({
			first_name,
			last_name,
			email,
			address,
			contact
		})

		guest.merge(values)

		await guest.save()

		return guest
	}

	async destroy(id) {
		const ids = _.split(id, ',')
		ids.forEach(async function(id){
			let guest = await Guest.findOrFail(id)
			await guest.delete()
		});
		
		return true
	}
}

module.exports = GuestService
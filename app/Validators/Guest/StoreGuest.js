'use strict'

class StoreGuest {
  get rules() {
    return {
      first_name: 'required',
      email: 'required|email|unique:guests,email',
      contact: 'required',
      address: 'required'
    }
  }

  get messages() {
    return {
      'email.unique': 'email already exists'
    }
  }

  get sanitizationRules() {
    return {
      email: 'normalize_email'
    }
  }

  async fails(errorMessages) {
    const e = this.ctx.response.apiResponse({ data: errorMessages, status: 'failed' })
    return this.ctx.response.send(e)
  }
}

module.exports = StoreGuest

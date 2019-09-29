'use strict'

class UpdateGuest {
  get rules() {
    const id = this.ctx.params.id

    /* 
    isUnique is a replacement of unique validator
    source: /start/hooks.js
    ref: https://github.com/duyluonglc/lucid-mongo/issues/211
    */

    return {
      first_name: 'required',
      email: `required|email|isUnique:guests,email,_id,${id}`,
      contact: 'required',
      address: 'required'
    }
  }

  get messages() {
    return {
      'email.isUnique': 'email already exists'
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

module.exports = UpdateGuest

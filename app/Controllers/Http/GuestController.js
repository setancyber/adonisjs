'use strict'

const GuestService = use('App/Services/GuestService')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with guests
 */
class GuestController {
  constructor() {
    this.guestService = new GuestService
  }

  /**
   * Show a list of all guests.
   * GET guests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) { 
    const limit = 10
    const page = parseInt(request.input('page'))
    const guests = await this.guestService.fetch(page, limit)
    
    return response.apiResponse({
      'data' : guests.toJSON() 
    })
  }

  /**
   * Create/save a new guest.
   * POST guests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const guest = await this.guestService.store(request.all())

    return response.apiResponse({
      'data' : guest.toJSON() 
    })
  }

  /**
   * Display a single guest.
   * GET guests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const guest = await this.guestService.find(params.id)

    return response.apiResponse({
      'data' : guest.toJSON() 
    })
  }

  /**
   * Update guest details.
   * PUT or PATCH guests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const guest = await this.guestService.update(request.all(), params.id)

    return response.apiResponse({
      'data' : guest.toJSON() 
    })
  }

  /**
   * Delete a guest with id.
   * DELETE guests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const guest = await this.guestService.destroy(params.id)
    const status = guest ? 'success' : 'failed'

    return response.apiResponse({
      'data' : null,
      'status' : status
    })
  }
}

module.exports = GuestController

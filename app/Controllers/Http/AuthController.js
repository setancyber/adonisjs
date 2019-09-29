'use strict'

const AuthService = use('App/Services/AuthService')

class AuthController {
  constructor() {
    this.authService = new AuthService
  }

  async login({ auth, request, response }) {
    const { email, password } = request.all()
    const login = await this.authService.login(auth, email, password)

    return response.apiResponse(login)
  }
}

module.exports = AuthController

'use strict'

const User = use('App/Models/User')
const _ = use('lodash')

class AuthService {
  async login(auth, email, password) {
    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email)
        let accessToken = await auth.generate(user)
        return { 
          status: 'success', 
          data: { 
            user: user, 
            access_token: accessToken 
          } 
        }
      }
    } catch (e) {
      return { 
        status: 'failed', 
        message: 'invalid username or password' 
      }
    }
  }

  async logout() {

  }
}

module.exports = AuthService
'use strict'

const { hooks } = use('@adonisjs/ignitor')

/* custom api response */
hooks.after.providersBooted(() => {
  const Response = use('Adonis/Src/Response')

  Response.macro('apiResponse', function (object) {
    if (!object.status) {
      if (object.data) {
        object.status = 'success'
      } else {
        object.status = 'failed'
      }
    }

    if (!object.message) {
      object.message = null
    }

    if (!object.data) {
      object.data = null
    }

    return object
  })
})

/* 
lucid-mongo unique validator is buggy and not fixed yet.
this custom hook would replace the original one 
ref: https://github.com/duyluonglc/lucid-mongo/issues/211
*/
hooks.after.providersBooted(() => {
  const Validator = use('Validator')
  const Database = use('Database')

  const existsFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return
    }

    /**
     * Extracting values of the args array
     */
    const [collection, fieldName, ignoreKey, ignoreValue] = args

    const whereConditions = {
      [fieldName || field]: value
    }

    /**
     * If a ignore key and value is defined, then add a whereNot clause
     */
    if (ignoreKey && ignoreValue) {
      if (ignoreKey === '_id') {
        const { ObjectId } = require('mongodb')
        whereConditions[ignoreKey] = { $ne: new ObjectId(ignoreValue) }
      } else {
        whereConditions[ignoreKey] = { $ne: ignoreValue }
      }
    }

    const row = await Database.collection(collection).where(whereConditions).count()

    if (row > 0) {
      throw message
    }
  }

  Validator.extend('isUnique', existsFn)
})
/**
* BotController
*/
const debug = require('debug')('michefood:ctrl:bot-ctrl')
const SlackService = require('../services/SlackService')
const FacebookService = require('../services/FacebookService')
const utils = require('../utils')
/**
 * Return a random list of places
 * @param {req} _
 * @param {res} res
 * @returns {Places[]} data
 */
async function index (req, res) {
  // Handler for the check route on slack
  if (req.body.challenge) {
    res.send({ 'challenge': req.body.challenge })
    return
  }

  // Handle the bot responses when direct message
  if (req.body.event.subtype || req.body.event.type !== 'message') {
    res.sendStatus(200)
    return
  }

  let { event: { text, channel }} = req.body

  // inmediate response for slack bot
  res.sendStatus(200)

  const commands = text.split(' ')

  // Not enough info
  if (!(commands.length > 1)) {
    SlackService.sendBotResponse('Necesito mas informacion :mestasenojando:', channel)
    return
  }

  switch (commands[0]) {
    case 'add':
      const fbUrl = commands[1].replace(/(<?>?)/g, '')
      const validUrl = utils.validateFbURL(fbUrl)

      // Invalid url send response to user
      if (!validUrl) {
        SlackService.sendBotResponse('La url no es de fb :mestasenojando:', channel)
        return
      }

      try {
        const newlyPlace = await FacebookService.addPlace(fbUrl)
        // Error registering the place
        if (!newlyPlace) {
          SlackService.sendBotResponse('Lo siento, no jalo ese facebok :sad:', channel)
          return
        }
        const message = `
          Listo!\nSe agrego ${newlyPlace.name} a nuestra lista de lugares.\nGracias por contribuir! :michelove:
        `
        SlackService.sendBotResponse(message, channel)
      } catch (error) {
        debug(error)
        SlackService.sendBotResponse(':sad:   :sad:   :sad:', channel)
      }
      break

    default:
      SlackService.sendBotResponse('Opciones disponibles:\n' + utils.BOT_OPTIONS.join('\n'), channel)
      break
  }
  // const promise = models.PlaceModel.aggregate().sample(5).exec()

  // return promise
  //   .then(function (data) {
  //     res.json(data)
  //   })
  //   .catch(function (err) {
  //     debug('Error - BotController@index: ', err)
  //     res.json({ message: 'Error on index daily top', error: err })
  //   })
}

module.exports = {
  index
}

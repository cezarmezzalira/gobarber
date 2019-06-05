const { User, Appointment } = require('../models')

const { Op } = require('sequelize')
const moment = require('moment')

class DashboardController {
  async index (req, res) {
    const { user } = req.session
    if (!user.provider) {
      const providers = await User.findAll({ where: { provider: true } })
      return res.render('dashboard', { providers })
    } else {
      const date = moment()
      const appointments = await Appointment.findAll({
        where: {
          provider_id: user.id,
          date: {
            [Op.between]: [
              date.startOf('day').format(),
              date.endOf('day').format()
            ]
          }
        },
        include: [
          {
            model: User,
            as: 'user'
          }
        ]
      })
      // console.log(appointments)
      return res.render('dashboard', { appointments })
    }
  }
}
module.exports = new DashboardController()

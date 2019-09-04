// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')

const testHelper = require('./test-helper')
const server = require('../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('Bot', () => {
  before(async () => {
    // Start and seed the db
    await testHelper.startDB()
  })

  after(async () => {
    // Stop and clear the db
    await testHelper.stopDB()
  })

  describe('/GET Bot', () => {
    it('should return a list of places', (done) => {
      chai.request(server)
        .get('/api/bot')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.lengthOf(5)
          done()
        })
    })
  })
})

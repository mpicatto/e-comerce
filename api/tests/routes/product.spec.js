/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Product, conn } = require('../../src/db.js');

const agent = session(app);
const product = {
  name: 'producto',
};

describe('PRODUCT routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Product.sync({ force: true })
    .then(() => Product.create(product)));
  describe('GET /products', () => {
    it('should get 200', () => 
      agent.get('/products/').expect(200)
    );
  });
});

describe('POST /sum', () => {
  it('responds with 200', () => agent.post('/products').expect(200));
  it('responds with something', () =>
    agent.post('/products')
      .send({name:"juan", description:"azul", price: 0.1, image:"doge", stock: 1})
      .then((res) => {
        const createdMessage = res.body;
        return Product.findByPk(createdMessage.id)
      })
        .then(foundMessage => {
          expect(foundMessage.name).to.be.equal('juan');
        })
  );
});

describe('Delete /products', () => {
  it('responds with 200', () => agent.post('/products').expect(200));
  it('responds with something', () =>
    agent.post('/products')
      .send({name:"juan", description:"azul", price: 0.1, image:"doge",stock:1})
      .then(function(res){
        agent.delete("/products/1")
      })
      .then(function(res) {
        agent.get("/products/").then((res)=> expect(res.length).to.be.equal(0))
    })
    .catch(function(err){})
  );
});
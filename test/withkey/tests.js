const expect  = require('chai').expect;
const {
  findNearBy,
  makeRequest,
} = require('../../api_controller');
const conf = require('../../conf');

describe('Test api_controller Functions with valid key', async() => {
  it('should make a request to google API places and return a response - (makeRequest)', async()=>{
    const customer = conf.customerInfo[2];
    const response1 = await makeRequest(customer, 32.779167, -96.808891, undefined, 1500); //Dallas
    expect(response1).to.be.an('object');
    expect(response1).to.have.own.property('status');
    expect(response1).to.have.own.property('results').with.lengthOf(20);
    expect(response1).to.have.own.property('next_page_token');
    const response2 = await makeRequest(customer, undefined, undefined, response1.next_page_token);
    expect(response2).to.be.an('object');
    expect(response2).to.have.own.property('status');
    expect(response2).to.have.own.property('results').with.lengthOf(20);
    expect(response2).to.have.own.property('next_page_token');
  })
  it('should find a number of near by places required in the configuration - (findNearBy)', async()=>{
    let response;
    response = await findNearBy(34.0522342,  -118.2436849, 'Happy Credit Union'); //Los angeles
    expect(response).to.be.an('array').with.lengthOf(20);
    response = await findNearBy(34.0522342,  -118.2436849, 'Paris FCU'); //Los angeles
    expect(response).to.be.an('array').with.lengthOf(5);
    response = await findNearBy(34.0522342,  -118.2436849, 'Sunrise Bank'); //Los angeles
    expect(response).to.be.an('array').with.lengthOf(200);
  })

});
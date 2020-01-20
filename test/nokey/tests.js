const expect  = require('chai').expect;
const {
  random,
  fixed,
  makeParamsReq1,
  makeParamsReq2,
} = require('../../api_controller');
const conf = require('../../conf');

describe('Test api_controller Functions', async() => {
  it('should return one random item from an array', ()=> {
    expect(random([ 'chai', 'java', 'roll' ])).to.be.a('string');
    expect(random([ 2, 3, 4,7,8,2 ])).to.be.a('number');
    expect(random([ {1 :'uno'},{ 2: 'dos'},{3: 'tres'} ])).to.be.an('object');

  });
  it('should fix a string to lowercase and no spaces', ()=>{
    expect(fixed(' This is AGoOd Test')).to.equal('thisisagoodtest');
    expect(fixed('Ab a LL o')).to.equal('aballo');
    expect(fixed('JAG HAR TENTEn')).to.equal('jaghartenten');
  });
  it('should build request parameters with lat, lng, radius, language, type', () =>{
    const customer1 = conf.customerInfo[0];
    const req1 = makeParamsReq1(customer1,22.3243, 44.3450, 1500);
    expect(req1).to.equal('xml?location=22.3243,44.345&radius=1500&type=atm&key=test&language=en');
    const customer2 = conf.customerInfo[1];
    const req2 = makeParamsReq1(customer2,22.3243, 44.3450, 1500);
    expect(req2).to.equal('json?location=22.3243,44.345&radius=1500&type=bank&key=test&language=es');
  });
  it('should build request parameters with pagetoken',()=>{
    const customer3 = conf.customerInfo[2];
    const req1 = makeParamsReq2(customer3,'ASDASDFEASDFASDFWERSDF234234234');
    expect(req1).to.equal('json?pagetoken=ASDASDFEASDFASDFWERSDF234234234&key=test');
    const customer4 = conf.customerInfo[0];
    const req2 = makeParamsReq2(customer4, '220303022555209023');
    expect(req2).to.equal('xml?pagetoken=220303022555209023&key=test');
  });
});
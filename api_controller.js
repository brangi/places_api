const axios = require('axios');
const _ = require('lodash');
const util = require('util');
const conf = require('./conf');
const parserXML = require('xml2js');
const parser = new parserXML.Parser({explicitArray : false});
const parseXml = util.promisify(parser.parseString);

const fixed = str => str.replace(/\s/g, '').toLowerCase();
const random = arr => _.shuffle(arr)[0];
const makeParamsReq1 = (c,lat, lng, rad) =>
  `${c.response}?location=${lat},${lng}&radius=${rad}&type=${c.type}&key=${c.api_key}&language=${c.language}`;
const makeParamsReq2 = (c,tok) =>
  `${c.response}?pagetoken=${tok}&key=${c.api_key}`;

const makeRequest =  async (customer, lat, lng, token, radius) => {
  let response, requestParams;
  if(token){
    switch(customer.response) {
    case 'xml':
      requestParams = makeParamsReq2(customer, token);
      response = await axios.get(`${conf.placeAPI}${requestParams}`);
      response = await parseXml(response.data);
      response = {
        status: response.PlaceSearchResponse.status,
        results: response.PlaceSearchResponse.result || [],
        next_page_token: response.PlaceSearchResponse.next_page_token && response.PlaceSearchResponse.next_page_token || undefined
      };
      break;
    case 'json':
      requestParams = makeParamsReq2(customer, token);
      response = await axios.get(`${conf.placeAPI}${requestParams}`);
      response = response.data;
      break;
    }
  } else {
    switch(customer.response) {
    case 'xml':
      requestParams = makeParamsReq1(customer, lat, lng, radius);
      response = await axios.get(`${conf.placeAPI}${requestParams}`);
      response = await parseXml(response.data);
      response = {
        status: response.PlaceSearchResponse.status,
        results: response.PlaceSearchResponse.result || [],
        next_page_token: response.PlaceSearchResponse.next_page_token && response.PlaceSearchResponse.next_page_token || undefined
      };
      break;
    case 'json':
      requestParams = makeParamsReq1(customer, lat, lng, radius);
      response = await axios.get(`${conf.placeAPI}${requestParams}`);
      response = response.data;
      break;
    }
  }

  return response;
};

const findNearBy = async (lat, lng, customerName)=> {
  const customer = conf.customerInfo.find(c => fixed(c.name) === fixed(customerName));
  if(customer){
    let currentRadius = conf.minRadius;
    let radiusTry = 0;
    const response = await makeRequest(customer, lat, lng, undefined, currentRadius);
    let tokenNext = response.next_page_token;
    let placesResult;
    let placesReturned = 0;

    while(!placesResult || placesReturned < customer.request_no){
      if(placesResult && placesResult.length > 0 && tokenNext){
        const response = await makeRequest(customer, lat, lng, tokenNext);
        tokenNext = response.next_page_token;
        placesResult = [...placesResult, ...response.results];
        placesResult  = _.uniqBy(placesResult, 'id');
        placesResult = placesResult.slice(0,customer.request_no);
        placesReturned = placesResult.length;
        radiusTry++;
      } else {
        if(!tokenNext && placesResult && placesResult.length > 0 ){
          currentRadius = currentRadius + 10000;
          let response;
          if(currentRadius >= conf.maxRadius || radiusTry > conf.maxRadiusTry){
            const randomPlace = random(placesResult);
            currentRadius = conf.minRadius;
            if(radiusTry > conf.maxRadiusTry) radiusTry = 0;
            response = await makeRequest(customer, randomPlace.geometry.location.lat, randomPlace.geometry.location.lng, undefined, currentRadius);
          } else {
            response = await makeRequest(customer, lat, lng, undefined, currentRadius);
          }
          tokenNext = response.next_page_token;
          placesResult = [...placesResult, ...response.results];
          placesResult  = _.uniqBy(placesResult, 'id');
          placesResult = placesResult.slice(0,customer.request_no);
          placesReturned = placesResult.length;
          radiusTry++;
        } else {
          placesResult = [...response.results];
          placesResult = placesResult.slice(0,customer.request_no);
          placesReturned = placesResult.length;
        }
      }
    }
    console.log(placesResult.length)
    return placesResult;
  } else {
    console.log('Not found');
  }

};


module.exports = {
  findNearBy
};

//findNearBy(34.0522342,  -118.2436849, 'Happy Credit Union'); //Los angeles Example
//findNearBy(34.0522342,  -118.2436849, 'Paris FCU'); //Los angeles Example
//findNearBy(34.0522342,  -118.2436849, 'Sunrise Bank'); //Los angeles Example



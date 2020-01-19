const axios = require('axios');
const _ = require('lodash');
const conf = require('./conf');

const fixed = str => str.replace(/\s/g, '').toLowerCase();
const random = arr => _.shuffle(arr)[0];
const makeParamsReq1 = (c,lat, lng, rad) =>
  `${c.response}?location=${lat},${lng}&radius=${rad || conf.minRadius}&type=${c.type}&key=${c.api_key}&language=${c.language}`;
const makeParamsReq2 = (c,tok) =>
  `${c.response}?pagetoken=${tok}&key=${c.api_key}`;

//const makeRequest = ({customer, lat, lng, type, token}) => {//
//

//};

const findNearBy = async (lat, lng, customerName)=> {
  const customer = conf.customerInfo.find(c => fixed(c.name) === fixed(customerName));
  if(customer){
    const reqParams1 = makeParamsReq1(customer, lat, lng);
    const urlReq = `${conf.placeAPI}${reqParams1}`;
    const res1 = await axios.get(urlReq);
    let tokenNext = res1.data.next_page_token;
    let currentRadius = conf.minRadius;
    let placesResult;
    let placesReturned = 0;

    while(!placesResult || placesReturned < customer.request_no){
      console.log(placesReturned);
      console.log(currentRadius);
      if(placesResult && placesResult.length > 0 && tokenNext){
        const reqParams2 = makeParamsReq2(customer, tokenNext);
        const res2 = await axios.get(`${conf.placeAPI}${reqParams2}`);

        tokenNext = res2.data && res2.data.next_page_token || undefined;
        placesResult = [...placesResult, ...res2.data.results];
        placesResult  = _.uniqBy(placesResult, 'id');
        placesReturned = placesResult.length;
      } else {

        if(!tokenNext && placesResult.length > 0 ){
          let reqParams1;
          currentRadius = currentRadius + 20000;
          if(currentRadius >= conf.maxRadius){
            const randomPlace = random(placesResult);
            currentRadius = conf.minRadius;
            reqParams1 = makeParamsReq1(customer, randomPlace.geometry.location.lat , randomPlace.geometry.location.lng, conf.minRadius);
          } else {
            reqParams1 = makeParamsReq1(customer, lat, lng, currentRadius);
          }
          const urlReq = `${conf.placeAPI}${reqParams1}`;
          const res = await axios.get(urlReq);
          tokenNext = res.data && res.data.next_page_token || undefined;

          placesResult = [...placesResult, ...res.data.results];
          placesResult  = _.uniqBy(placesResult, 'id');
          placesResult = placesResult.slice(0,customer.request_no);
          placesReturned = placesResult.length;
        } else {
          placesResult = [...res1.data.results];
          placesResult = placesResult.slice(0,customer.request_no);
          placesReturned = placesResult.length;
        }
      }

    }
    return placesResult;
  } else {
    console.log('Not found');
  }

};

findNearBy(19.432777, -99.133217, 'Sunrise Bank');


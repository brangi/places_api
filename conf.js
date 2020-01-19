
module.exports = {
  customerInfo:[
    {
      name :'Sunrise Bank',
      api_key: 'AIzaSyAptoEhIrPGU6QLb9h3wi2VCiFOfENH_sM',
      language :'en',
      type: 'atm',
      response :'json',
      request_no:200
    },
    {
      name :'Happy Credit Union',
      api_key: 'AIzaSyAptoEhIrPGU6QLb9h3wi2VCiFOfENH_sM',
      language :'es',
      type: 'bank',
      response :'json',
      request_no: 20
    },
    {
      name :'Paris FCU',
      api_key: 'AIzaSyAptoEhIrPGU6QLb9h3wi2VCiFOfENH_sM',
      language :'fr',
      type: 'all',
      response :'json',
      request_no: 5
    },
  ],
  placeAPI:'https://maps.googleapis.com/maps/api/place/nearbysearch/',
  defaultReq:20,
  minRadius:  1500,
  maxRadius:  50000
};



# Places API

Return a number places nearby by providing latitute, longitude and a customer name

### Before anyting, add correct keys from the required configuraion

```
module.exports = {
  customerInfo:[
    {
      name :'Sunrise Bank',
      api_key: process.env.NODE_ENV ==='test_nokey' ? 'test' : '', // ADD KEY HERE
      language :'en',
      type: 'atm',
      response :'xml',
      request_no: 200
    },
    {
      name :'Happy Credit Union',
      api_key: process.env.NODE_ENV ==='test_nokey' ? 'test' : '', // ADD KEY HERE
      language :'es',
      type: 'bank',
      response :'json',
      request_no: 20
    },
    {
      name :'Paris FCU',
      api_key: process.env.NODE_ENV ==='test_nokey' ? 'test' : '',// ADD KEY HERE
      language :'fr',
      type: 'all',
      response :'json',
      request_no: 5
    },
  ],
  placeAPI:'https://maps.googleapis.com/maps/api/place/nearbysearch/',
  defaultReq:20,
  maxRadiusTry: 5,
  minRadius:  1500,
  maxRadius:  50000
};

```

Get dependencies

```
npm install
```

### Install

Get dependencies

```
npm install
```

### Run server

```
> node server.js

Starting in port 3000
```

### API requests example

```
GET localhost:3000/places?lat=34.0522342&lng=-118.2436849&name=Happy Credit Union
[
    {
        "geometry": {
            "location": {
                "lat": 34.0533135,
                "lng": -118.2536384
            },
            "viewport": {
                "northeast": {
                    "lat": 34.0545410302915,
                    "lng": -118.2519246697085
                },
                "southwest": {
                    "lat": 34.0518430697085,
                    "lng": -118.2546226302915
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/bank_dollar-71.png",
        "id": "ea619dd1e6c420d9c7300a89f8d7716ca9d4af97",
        "name": "Bank of America Financial Center",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 1365,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/104908431756212890221\">Jay E. Jenkins</a>"
                ],
                "photo_reference": "CmRaAAAAaUobWxPgTvJYdY3A5q_YowVe44rXeUg_9N7DJTKRtoY8M3XsFeZSc6Z3cinMU0GevalnbZYQ1g-fY8piLHiIK9qvOkrFr_q8ZsXk0GURGOIXbdOETaR2TdjpvD6OzDX6EhCcYVMCPMXNaOxa6gplWqJVGhSDUH4mpasK1nCvkSHeOEzqgsk6qg",
                "width": 2048
            }
        ],
        "place_id": "ChIJvTeDLU3GwoAR5JZYnapXBg8",
        "plus_code": {
            "compound_code": "3P3W+8G Los Ángeles, California, Estados Unidos",
            "global_code": "85633P3W+8G"
        },
        "rating": 3.8,
        "reference": "ChIJvTeDLU3GwoAR5JZYnapXBg8",
        "scope": "GOOGLE",
        "types": [
            "bank",
            "finance",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 41,
        "vicinity": "333 South Hope Street STE 100, Los Angeles"
    },...
]
```


### Running test cases

```
$ npm run test

> npm run test:nokey && npm run test:withkey1 && npm run test:withkey2


> NODE_ENV=test_nokey ./node_modules/mocha/bin/mocha --recursive test/nokey/tests.js



  Test api_controller Functions
    ✓ should return one random item from an array
    ✓ should fix a string to lowercase and no spaces
    ✓ should build request parameters with lat, lng, radius, language, type
    ✓ should build request parameters with pagetoken


  4 passing (9ms)


> NODE_ENV=test_withkey ./node_modules/mocha/bin/mocha --timeout 300000 --recursive  -g '(makeRequest)' test/withkey/tests.js



  Test api_controller Functions with valid key
    ✓ should make a request to google API places and return a response - (makeRequest) (969ms)


  1 passing (974ms)


> NODE_ENV=test_withkey ./node_modules/mocha/bin/mocha --timeout 300000 --recursive -g '(findNearBy)' test/withkey/tests.js



  Test api_controller Functions with valid key
    ✓ should find a number of near by places required in the configuration - (findNearBy) (65934ms)


  1 passing (1m)

```

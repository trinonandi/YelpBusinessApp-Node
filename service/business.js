const axios = require("axios");
const secrets = require("../secrets")
baseUrl = 'https://api.yelp.com/v3/businesses'

// function to search
function searchBusiness(req, res) {
    req.query.limit = 10;
    axios({
        url: baseUrl + '/search',
        params: req.query,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + secrets.apiKey
        }
    })
        .then((r) => {
            const response = r.data.businesses;
            let data = []
            for(let i=0; i<response.length; i++) {
                obj = response[i];
                const item = {
                    'serial_no': i+1,
                    'id': obj.id,
                    'name': obj.name,
                    'image_url': obj.image_url,
                    'url': obj.url,
                    'rating': obj.rating,
                    'distance': convertMeterToMiles(obj.distance).toFixed(2)
                }
                data.push(item);
            }
            res.status(200).send(data)
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({'error' : err})
        })
}



function convertMeterToMiles(meter) {
    return meter / 1609;
}


// function to get details about a business
function getBusinessDetails(req, res) {
    axios({
        url: baseUrl + '/' + req.query.id,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + secrets.apiKey
        }
    })
        .then((r) => {
            const obj = r.data;
            // console.log(obj);
            let data = {};
            if ('categories' in obj) {
                let category = []
                obj.categories.forEach((e) => {
                    category.push(e['title'])
                })
                data['categories'] = category
            }

            if('name' in obj) {
                data['name'] = obj['name'];
            }

            if('hours' in obj && obj['hours'].length > 0) {
                if('is_open_now' in obj['hours'][0]) {
                    data['is_open'] = obj['hours'][0]['is_open_now'];
                }
            }

            if('location' in obj) {
                if('display_address' in obj['location']) {
                    data['address'] = obj['location']['display_address'];
                }
            }

            if('photos' in obj) {
                data['photos'] = obj['photos'];
            }

            if('display_phone' in obj) {
                data['phone'] = obj['display_phone'];
            }

            if('price' in obj) {
                data['price'] = obj['price']
            }

            if('transactions' in obj) {
                data['transactions'] = obj['transactions']
            }

            if('url' in obj) {
                data['url'] = obj['url']
            }

            if('coordinates' in obj) {
                data['lat'] = obj['coordinates']['latitude'];
                data['lng'] = obj['coordinates']['longitude'];
            }
            if('id' in obj) {
                data['id'] = obj['id'];
            }
            res.send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({'error' : err})
        })
}

// function for autocomplete feature
function autocomplete(req, res) {
    if(req.query.keyword.length === 0) {
        res.send('');
        return;
    }
    const completeUrl= 'https://api.yelp.com/v3/autocomplete?text=' + req.query.keyword;
    axios({
        url: completeUrl,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + secrets.apiKey
        }
    })
        .then((r) => {
            const obj = r.data;
            let data = [];
            obj.categories.forEach((e) => {
                data.push(e.title);
            });

            obj.terms.forEach((e) => {
                data.push(e.text)
            });

            res.send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({'error' : err});
        })
}

function getReview(req, res) {
    axios({
        url: baseUrl + '/' +req.query.id + '/reviews',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + secrets.apiKey
        }
    })
        .then((r) => {
            const obj = r.data.reviews;
            let data = [];
            let count = 3;
            for(let i=0; i<obj.length && count > 0; i++, count--) {
                let temp = {};
                temp['rating'] = obj[i]['rating'];
                temp['user_name'] = obj[i]['user']['name'];
                temp['text'] = obj[i]['text'];
                temp['time_created'] = obj[i]['time_created'];

                data.push(temp);
            }

            res.send(data);
;        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({'error': err});
        })
}

module.exports = {searchBusiness, getBusinessDetails, autocomplete, getReview}
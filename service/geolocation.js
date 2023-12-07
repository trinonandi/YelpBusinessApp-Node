const secrets = require("../secrets");
const axios = require("axios");

const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json"

function getCoordinates(req, res) {
    axios({
        url: baseUrl,
        params: {
            address: req.query.address,
            key: secrets.geoApiKey
        },
        method: 'GET'
    })
        .then((r) => {
            let obj = r.data;
            if(obj['status'] !== 'OK') {
                res.send({'error' : obj['status']});
                return;
            }
            obj = obj['results'];
            if(obj.length === 0) {
                res.status(404).send({'error': 'No such location'});
                return;
            }

            res.send(obj[0]['geometry']['location']);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({'error': err});
        })
}

module.exports = {getCoordinates}
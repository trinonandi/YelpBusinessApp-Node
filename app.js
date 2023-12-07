const express = require('express');
const app = express();
const port = 8080;
const business = require('./service/business')
const geolocation = require('./service/geolocation')
const cors = require('cors')

app.use(cors())
app.use(express.static(process.cwd()+"/static/business-app/"));
app.use(express.static(process.cwd()+"/static/business-app/assets"));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/static/business-app/index.html')
})

app.get('/search', (req, res) => {
    res.sendFile(process.cwd() + '/static/business-app/index.html')
})

app.get('/bookings', (req, res) => {
    res.sendFile(process.cwd() + '/static/business-app/index.html')
})

app.get('/api/v1/search', (req, res) => {
    business.searchBusiness(req, res);
});

app.get('/api/v1/get_business_data', (req, res) => {
    business.getBusinessDetails(req, res);
});

app.get('/api/v1/autocomplete', (req, res) => {
    business.autocomplete(req, res);
});

app.get('/api/v1/get_coordinates', (req, res) => {
    geolocation.getCoordinates(req, res);
});

app.get('/api/v1/get_review', (req, res) => {
    business.getReview(req, res);
})

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}`)
});
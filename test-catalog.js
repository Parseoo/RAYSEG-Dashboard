const axios = require('axios');
axios.get('http://localhost:8000/api/catalog/name/client-segment').then(res => console.log(JSON.stringify(res.data, null, 2))).catch(err => console.log(err.message));

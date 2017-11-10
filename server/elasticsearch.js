const elasticsearch = require('elasticsearch');
const promise = require('bluebird');

const elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

elasticClient.ping({
  // ping usually has a 3000ms timeout 
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('ERROR elasticsearch is down!');
  } else {
    console.log('YAY Elasticsearch connected!');
  }
});

client.updateByQuery([params, [callback]])

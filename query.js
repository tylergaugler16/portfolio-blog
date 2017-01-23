var pg = require('pg');
// var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/blog';
var connectionString = process.env.DATABASE_URL;

module.exports = function(queryString, queryParameters, onComplete) {
  if (typeof queryParameters == 'function') {
    onComplete = queryParameters;
    queryParameters = [];
  }

   pg.connect(connectionString, function(err, client, done) {
     if (err) {
       console.log(`error: connection to database failed. connection string: "${connectionString}" ${err}`);
        if (client) {
           done(client);
           }
        if (onComplete) {
           onComplete(err);
         }
         return;
       }
       client.query(queryString, queryParameters, function(err, result) {
          if (err) {
             done(client);
             console.log(`error: query failed: "${queryString}", "${queryParameters}", ${err}`);
              }
            else{
                done();
              }
           if (onComplete) {
             onComplete(err, result);
           }
         });
       });
     };

process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = 'mongodb://darioxlz:28462837x*@cluster0-shard-00-00-rif5r.mongodb.net:27017,cluster0-shard-00-01-rif5r.mongodb.net:27017,cluster0-shard-00-02-rif5r.mongodb.net:27017/cafe?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
}

process.env.URLDB = urlDB;
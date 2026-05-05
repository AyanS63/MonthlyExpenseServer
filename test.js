const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://Ayan:ForzaHorizon5@ac-vcvdtju-shard-00-00.vk4ahux.mongodb.net:27017,ac-vcvdtju-shard-00-01.vk4ahux.mongodb.net:27017,ac-vcvdtju-shard-00-02.vk4ahux.mongodb.net:27017/monthly_expenses?tls=true&replicaSet=atlas-vcvdtju-shard-0&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } catch(e) {
    console.error("Connection failed:", e);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

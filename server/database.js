const { MongoClient, ObjectID } = require('mongodb')

const url = 'mongodb://localhost:27017';
const dbName = 'boatshop';
const collectionName = 'boats';


function getAllBoats(callback) {
	get({}, callback)
}


function getBoat(id, callback) {
	get({ _id: new ObjectID(id) }, array => callback( array[0] ))
}




function get(filter, callback) {
	MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) => {
			if( error ) {
				callback('"ERROR!! Could not connect"');
				return;  
			}
			const col = client.db(dbName).collection(collectionName);
			try {
				const cursor = await col.find(filter);
				const array = await cursor.toArray()
				callback(array);

			} catch(error) {
				console.log('Query error: ' + error.message);
				callback('"ERROR!! Query error"');

			} finally {
				client.close();
			}


			
		}
	)
}

function addBoat(requestBody, callback) {
	
	const doc = requestBody
	MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) => {
			if( error ) {
				callback('"ERROR!! Could not connect"');
				return;  
			}
			const col = client.db(dbName).collection(collectionName);
			try {				
				const result = await col.insertOne(doc);
				callback({
					result: result.result,
					ops: result.ops
				})

			} catch(error) {
				console.error('addHat error: ' + error.message);
				callback('"ERROR!! Query error"');

			} finally {
				client.close();
			}
		}
	)
}


async function search(query, callback) {
	const filter = {};
	let sortMethod = {};
	
	
	if( query.word ){
		filter.model={ "$regex": `.*${query.word}.*`,"$options":"si"};
		
	}
	if( query.maxprice){
		filter.price={$lt: Number(query.maxprice)}
	}
	if( query.madebefore ){
		filter.model_year={$lt: Number(query.madebefore)}
	}
	if( query.madeafter ){
		filter.model_year={$gt: Number(query.madeafter)}
	}
	if(query.is_sail){
		filter.sail=(query.is_sail)//om yes i Q-stringen
	}
	if(query.has_motor){
		filter.motor=(query.has_motor)//om yes i Q-stringen
	}
	

	switch (query.order) {
		case "lowprice":
			sortMethod = {price : 1};
			break;
		case "name_asc":
			sortMethod = {model : -1};
			break;
		case "name_desc":
			sortMethod = {model : 1};
			break;
		case "oldest":
			sortMethod = {model_year : 1};
			break;	
		case "newest":
			sortMethod = {model_year : -1};
			break;	
		default:
			sortMethod = {model : 1};
	}
	

		MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) => {
			if( error ) {
				callback('"ERROR!! Could not connect"');
				return;  
			}
			
			const col = client.db(dbName).collection(collectionName);
			
			try {
				const cursor = await col.find(filter).sort(sortMethod);
				const array = await cursor.toArray()
				callback(array);

			} catch(error) {
				console.log('Query error: ' + error.message);
				callback('"ERROR!! Query error"');

			} finally {
				client.close();
			}
		}
	)
}



	function deleteBoat(id, callback) {
		console.log('/delete')
		const obj = {_id: new ObjectID(id)}

		MongoClient.connect(
			url,
			{ useUnifiedTopology: true },
			async (error, client) => {
				if( error ) {
					callback('"ERROR!! Could not connect"');
					return;  // exit the callback function
				}
				const col = client.db(dbName).collection(collectionName);
				
				try {
					const result = await col.deleteOne(obj);
				callback({
					result: result.result,
					ops: result.ops
				})
	
				} catch(error) {
					console.log('Query error: ' + error.message);
					callback('"ERROR!! Query error"');
	
				} finally {
					client.close();
				}
	
	
			}
		)
	}


module.exports = {
	getAllBoats, getBoat, addBoat, search, deleteBoat
}
"use strict";

const path = require("path");
const mkdir = require("mkdirp").sync;

const DbService = require("moleculer-db");

module.exports = function (collection) {
	// if (process.env.MONGO_URI) {
	if (true) {
		// Mongo adapter
		const MongoAdapter = require("moleculer-db-adapter-mongo");

		return {
			mixins: [DbService],
			adapter: new MongoAdapter(
				"mongodb://root:password0@cluster0-shard-00-00.6ormx.mongodb.net:27017,cluster0-shard-00-01.6ormx.mongodb.net:27017,cluster0-shard-00-02.6ormx.mongodb.net:27017/provadb?ssl=true&replicaSet=atlas-ek7xig-shard-0&authSource=admin&retryWrites=true&w=majority",
				{ useNewUrlParser: true, useUnifiedTopology: true }
			),
			collection,
		};
	}

	// --- NeDB fallback DB adapter

	// Create data folder
	mkdir(path.resolve("./data"));

	return {
		mixins: [DbService],
		adapter: new DbService.MemoryAdapter({ filename: `./data/${collection}.db` }),

		methods: {
			async entityChanged(type, json, ctx) {
				await this.clearCache();
				const eventName = `${this.name}.entity.${type}`;
				this.broker.emit(eventName, { meta: ctx.meta, entity: json });
			}
		}
	};
};

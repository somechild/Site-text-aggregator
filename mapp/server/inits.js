
// Setting up npm requirements
if (Meteor.isServer) {
	cheerio = Meteor.npmRequire("cheerio");
	request = Meteor.npmRequire("request");
	Future = Meteor.npmRequire("fibers/future");
	Fiber = Meteor.npmRequire("fibers");

	fs = Meteor.npmRequire("fs");
	xlsx = Meteor.npmRequire("node-xlsx");
};
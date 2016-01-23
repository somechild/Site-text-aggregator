if (Meteor.isServer) {
	cheerio = Meteor.npmRequire("cheerio");
	request = Meteor.npmRequire("request");
	Future = Meteor.npmRequire("fibers/future");
	Fiber = Meteor.npmRequire("fibers");
};
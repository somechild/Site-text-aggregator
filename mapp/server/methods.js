if (Meteor.isServer) {
	//abs. no security features rn
	Meteor.methods({
		getText: function (siteUrl) {
			if (siteUrl) {

				var fut = new Future();
				request(siteUrl, function(err, resp, html) {
					if (err) {
						var errr = err;
						errr.isError = true;
						fut['return'](errr);
					}
					else{
						var txtToRet = {
							txt: "",
							adder(a) {
								this.txt+= (a && a.length? a + " ": "");
							}
						};
						$ = cheerio.load(html);
						
						var title = $('head>title').text();
						txtToRet.adder(title);

						var metaDescr = $('head>meta[name="description"]').attr('content');
						txtToRet.adder(metaDescr);

						var metaKeywds = $('head>meta[name="keywords"]').attr('content');
						txtToRet.adder(metaKeywds);

						$('h1').each(function() {
							txtToRet.adder($(this).text());
						}); $('h2').each(function() {
							txtToRet.adder($(this).text());
						}); $('h3').each(function() {
							txtToRet.adder($(this).text());
						}); $('h4').each(function() {
							txtToRet.adder($(this).text());
						});

						$('b').each(function() {
							txtToRet.adder($(this).text());
						}); $('i').each(function() {
							txtToRet.adder($(this).text());
						}); $('li').each(function() {
							txtToRet.adder($(this).text());
						}); $('td').each(function() {
							txtToRet.adder($(this).text());
						}); $('p').each(function() {
							txtToRet.adder($(this).text());
						}); $('a').each(function() {
							txtToRet.adder($(this).text());
						}); $('span').each(function() {
							txtToRet.adder($(this).text());
						});


						txtToRet.txt = txtToRet.txt.split(' ').reduce(function(p, c) {
							return p + " " + ((c.indexOf("loading") + c.indexOf("Loading") + c.indexOf("processing") + c.indexOf("Processing")) == -4? c: "");
						});
						txtToRet.txt = txtToRet.txt.replace(/(\r\n|\n|\r)/gm, " ").replace(/\n|\s|\r|\t/g, " ").replace("  ", " ").replace("   ", " ").trim();

						fut['return'](txtToRet.txt);
					};
				});


				if (typeof fut.wait() == "string")
					return fut.wait();
				else if (fut.wait().isError) {
					throw new Meteor.Error("Error requesting the html from this url");
				};
			}
			else
				throw new Meteor.Error('No url');
		}
	});
};
if (Meteor.isServer) {
	//abs. no security features rn, this is just a simple method to get text of a site
	Meteor.methods({
		getText: function (siteUrl) {
			if (siteUrl) {

				// create a future waiting for final text to be set
				var fut = new Future();

				// send out request
				request(siteUrl, function(err, resp, html) {
					// handle request errors
					if (err) { 
						var errr = err;
						errr.isError = true;
						fut['return'](errr);
					}
					else{

						// object containing text to return and a method to update text to return
						var txtToRet = {
							txt: "",
							adder(a) {
								this.txt+= (a && a.length? a + " ": "");
							}
						};

						// load cheerio to traverse response html
						$ = cheerio.load(html);
						

						// below, text will be added in textToRet.txt according to higherarch

							//--- document head tag items go in there first, then h1,etc. tags, then other html marked up stuff

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

						// --------------- end adding text --------------




						//clean up text formatting to remove useless words and spaces
						txtToRet.txt = txtToRet.txt.split(' ').reduce(function(p, c) {
							return p + " " + ((c.indexOf("loading") + c.indexOf("Loading") + c.indexOf("processing") + c.indexOf("Processing")) == -4? c: "");
						});


						txtToRet.txt = txtToRet.txt.replace(/(\r\n|\n|\r)/gm, " ").replace(/\n|\s|\r|\t/g, " ").replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ").trim();


						//return text
						fut['return'](txtToRet.txt);
					};
				});


				//handle error or return string of scraped text
				if (typeof fut.wait() == "string")
					return fut.wait();
				else if (fut.wait().isError)
					throw new Meteor.Error("Error requesting the html from this url");
			}
			else
				throw new Meteor.Error('No url');
		}
	});
};

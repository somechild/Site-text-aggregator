if (Meteor.isServer) {
	var xlsxDataToUse = {
		spreadSheetIndex: 1, //which spreadsheet contains data you're looking for - starts at 1
		webUrlColumnNo: 1, //which column are the urls in - starts with 1
		webUrlsStartAtRowNo: 2, //which row do the website urls start at
		textEntryColumns: [3, 4, 5, 6], //which columns to use to enter the text retrieved from websites
											//--> as excel limits text inputs to 32,767 characters, use a couple columns to span the website text over --> the rest will be cut off if there are no more columns left
	};


	//the spreadsheet that is created afterwards
	var NewSpreadsheet = {
		title: "SheetWithDataFetched.xlsx", //title for it
		prefReplaceSpChars: true  // if you would special chars like the following to be removed -> ~!@#$%^&*()-_+=|{}[];'":.></?`
	};



	//begin parsing xls spreadhseet
	console.log('Reading file...');

	
	var xlsxItem = xlsx.parse(Meteor.absolutePath + '/server/BookToWorkWith.xlsx');

	// get an array of urls from spreadhseet
	var listOfUrls = xlsxItem[xlsxDataToUse.spreadSheetIndex - 1].data.map(function(elem, i) {
		if (i < xlsxDataToUse.webUrlsStartAtRowNo-1)
			return;
		else {
			return elem[xlsxDataToUse.webUrlColumnNo-1];
		}
	});

	var listOfText = [];
	// future waiting on listOfText being fully populated
	var fut2 = new Future();

	

	//send out requests for each url in spreadsheet

	console.log('Sending '+listOfUrls.length+' scrape requests...');

	listOfUrls.forEach(function (e, i) {
		if (!e)
			listOfText[i] = ('');
		else{
			Meteor.call('getText', e, function(err, resp) {
				if (err) {
					listOfText[i] = "Error reading this url";
					console.log('There has been an error in the response for the url at row ' + (i+1));
				}
				else{
					listOfText[i] = NewSpreadsheet.prefReplaceSpChars? resp./*replace(/[^\w\s]/gi, ' ')*/replace(/[`—–~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/^\s+|\s+$/g, "").replace(/\s+/g, " "): resp;
					console.log('Scraped text response for url at row ' + (i+1) + ' of total ' + listOfUrls.length + ' rows has been recieved');
				};
			});
		};

		if (i+1 == listOfUrls.length)
			fut2['return'](true); //XX1XX -- if all requests recieved, continue code -- XX1XX
	});

	console.log('Scrape requests sent, just waiting on them...');




	 //XX1XX -- if all requests recieved, continue code -- XX1XX

	if (fut2.wait() === true) { 
		console.log('Scrape responses recieved, creating new spreadsheet..');


		// put scraped text back into a spreadsheet format
		xlsxItem[xlsxDataToUse.spreadSheetIndex - 1].data = xlsxItem[xlsxDataToUse.spreadSheetIndex - 1].data.map(function(e, i) {
			var el = e;
			
			if (i >= (xlsxDataToUse.webUrlColumnNo-1)) {

				var textToEnter = listOfText[i];

				// go through each possible text entry column as specified by at the top
				for (var i = 0; i < xlsxDataToUse.textEntryColumns.length; i++) {


					//below the text to enter in the current column will be cropped by the cell text entry limit set by excel
					var thisText = textToEnter;
					
					if (textToEnter.length > 32500) {
						thisText = thisText.slice(0, 32500);
						textToEnter = textToEnter.slice(32500);
					}
					else{
						textToEnter = "";
					};

					//end text to enter cropping


					//update parsed document's cell with keywords text
					if (thisText && thisText.length) {
						var colToEnterIn = xlsxDataToUse.textEntryColumns[i] - 1;
						el[colToEnterIn] = thisText;
					};


				};
			};

			// return modified row entry
			return el;
		});

		
		console.log('Spreadsheet created, a few more seconds to save it...');
		//build spreadsheet into buffer
		NewSpreadsheet.buffer = xlsx.build(xlsxItem);

		//write new spreadsheet to server folder
		writeFile(NewSpreadsheet.title, NewSpreadsheet.buffer);
	};




	//method for writing spreadsheet to server folder
	function writeFile(title, buffer) {
		fs.writeFile(Meteor.absolutePath + '/server/' + title, buffer, function(err) {
			if (err)
				console.log(err);
			else
				console.log(NewSpreadsheet.title + ' has been saved!');
		});
	};

};
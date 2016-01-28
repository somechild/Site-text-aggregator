if (Meteor.isClient) {

	Template.hello.events({
		'click button': function () {
			var txt = $('input[type="text"]').val();

			// urlValidator() function obtained from https://github.com/Notebulb/Form-Validator
			
			if (txt.trim().length && urlValidator(txt).isSuccess) {
				makeHTMLCALL(txt);
			}
			else{
				alert('Invalid url');
			};
		}
	});


	function makeHTMLCALL(txt) {
		Meteor.call('getText', txt, function (error, result) {
			if (error) {
				alert("There has been an error in obtaining text from the website");
			}
			else{
				console.log(result);
				$('p').text(result);
			};
		});
	};

};
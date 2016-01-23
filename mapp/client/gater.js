if (Meteor.isClient) {

	Template.hello.events({
		'click button': function () {
			var txt = $('input[type="text"]').val();
			makeHTMLCALL(txt);
		}
	});
	Template.hello.rendered = function () {
		// var i = 0;
		// setInterval(function() {
		// 	makeHTMLCALL(arr[i]);
		// 	i++;
		// }, 2500);
	};


	function makeHTMLCALL(txt) {
		Meteor.call('getText', txt, function (error, result) {
			if (error) {
				alert("fucking error");
			}
			else{
				console.log(result);
				$('p').text(result);
			};
		});
	};

};
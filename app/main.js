$(function(){
	let observers = [];
	let space = new Space();

	$('.observer').each(function () {
		let options = {
			container: this,
			space: space
		}
		observers.push(new Observer(options));
	});
});

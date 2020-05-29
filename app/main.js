class Space
{
}

class Observer
{
}

$(function(){
	let observers = [];
	let space = new Space();

	$('.observer').each(function () {
		observers.push(new Observer(this, space));
	});
});

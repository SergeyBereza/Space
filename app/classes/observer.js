class Observer
{
	constructor (options)
	{
		this.space = options.space;
		this.container = $(options.container);
		this.width = this.container.width();
		this.height = this.container.height();
		this.scale = 12;
		this.position = { x: 0, y: 0, z: 0 };

		this.createSVG();
		this.createScaleGrid();
		this.updateSpace();

		let observer = this;
		$(this.container).on('mousemove', function(event) {
			if (event.buttons != 1) return true;

			observer.position.x += event.originalEvent.movementX * observer.scale;
			observer.position.y += event.originalEvent.movementY * observer.scale;

			observer.createScaleGrid();
			observer.updateSpace();
		});

		$(this.container).on('wheel', function(event) {
			observer.scale *= 1 + event.originalEvent.deltaY / 1000;
			observer.createScaleGrid();
			observer.updateSpace();
		});

		$(this.container).on('click', '[data-code]', (evnt) => {
			let $this = $(evnt.currentTarget);
			let code = $this.data('code');
			let id = 'spaceObjectStats_' + code;

			let obj = $('#' + id);
			console.log(obj);
			if (obj.length == 0) {
				let dialog = '<div id="' + id + '">' + $('#spaceObjectStats').html() + '</div>';
				$('#storage').append(dialog);
				$('#' + id).dialog({
					resizable: false,
					title: observer.space.objects[code].data.name,
					close: (evnt, ui) => {
						console.log(id);
						$('#' + id).dialog('destroy').remove();
					}
				});
				this.space.objects[code].statsContainer = $('#' + id);
			}

			console.log(code);
			console.log(this.space.objects[code].data);
		});

		window.setInterval(function() {
			observer.updateSpace();
		}, 1000);
	}

	createSVG () {
		var text =
			'<div class="stats" style="color:white;position:absolute"></div>' +
			'<svg viewBox="0 0 ' + this.width + ' ' + this.height + '" width="' + this.width + 'px" height="' + this.height + 'px" style="background-color:#222">' +
				'<rect class="observerWindow" x="0" y="0" width="' + this.width + '" height="' + this.height + '" fill="none" stroke="#222"/>' +
				'<g class="observerScaleGrid" stroke="#888" stroke-width="1"></g>' +
				'<g class="observerObjectes" fill="#fff"></g>' +
				'<defs></defs>' +
			'</svg>';

		this.container.html(text);
	}

	createScaleGrid ()
	{
		let text;

		let distance = 10000 / this.scale;
		let startX = ((this.position.x + (this.width >> 1) * this.scale) % (this.scale * distance) / this.scale);
		let startY = ((this.position.y + (this.height >> 1) * this.scale) % (this.scale * distance) / this.scale);

		for (let i = startX; i < this.width; i += distance) {
			text += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="' + this.height + '"/>';
		}

		for (let i = startY; i < this.height; i += distance) {
			text += '<line x1="0" y1="' + i + '" x2="' + this.width + '" y2="' + i + '"/>';
		}

		$('.observerScaleGrid', this.container).html(text);
	}

	updateSpace ()
	{
		this.space.tick();
		this.showSpaceObjects();
		this.showObserverStats();
	}

	showSpaceObjects()
	{
		let text = '';
		for (let code in this.space.objects) {
			let object = this.space.objects[code].data;

			let objectX = (this.width >> 1) + (this.position.x + object.position.x) / this.scale;
			let objectY = (this.height >> 1) + (this.position.y + object.position.y) / this.scale;
			let objectR = Math.max(object.radius / this.scale, 5);

			text += '<circle data-code="' + object.code + '" cx="' + objectX + '" cy="' + objectY + '" r="' + objectR + '"/>';
		}
		$('.observerObjectes', this.container).html(text);
	}

	showObserverStats()
	{
		let text = '2020-05-30 11:03:50<br>X: ' + this.position.x + ' км<br>Y: ' + this.position.y + ' км<br>Scale: ' + this.scale + ' км';
		this.container.find('.stats').html(text);
	}
}

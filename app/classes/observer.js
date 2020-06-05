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
		this.statsContainer = false;
		this.timeControl = 1;

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
			if (obj.length == 0) {
				let dialog =
					'<div id="' + id + '">' +
						$('#spaceObjectStats').html() +
					'</div>';
				$('#storage').append(dialog);
				$('#' + id).dialog({
					resizable: false,
					title: observer.space.objects[code].data.name,
					close: (evnt, ui) => {
						$('#' + id).dialog('destroy').remove();
					}
				});
				this.space.objects[code].statsContainer = $('#' + id);
				this.space.objects[code].displayStats();
			}
		});

		$(this.container).on('click', '.showStats', (evnt) => {
			let $this = $(evnt.currentTarget);
			let id = 'observerStats_1';

			let obj = $('#' + id);
			if (obj.length == 0) {
				let dialog =
					'<div id="' + id + '">' +
						$('#observerStats').html() +
					'</div>';
				$('#storage').append(dialog);
				$('#' + id).dialog({
					resizable: false,
					title: 'Обозреватель #1',
					close: (evnt, ui) => {
						$('#' + id).dialog('destroy').remove();
						$this.show();
					}
				});

				$this.hide();
				this.statsContainer = $('#' + id);
				this.showStats();
			}
		});

		$('body').on('click', '.timecontrol', (evnt) => {
			let $this = $(evnt.currentTarget);
			let op = $this.data('op');

			if (op == 0) {
				this.timeControl = 0;
			} else if (op == 1) {
				this.timeControl = 1;
			} else if (op == 2) {
				this.timeControl *= 2;
			} else if (op == -2) {
				this.timeControl /= 2;
			}

			this.showStats();
		});

		window.setInterval(function() {
			observer.updateSpace();
		}, 1000);
	}

	createSVG () {
		var str = $('#observerBlock')
			.html()
			.replace(/#WIDTH#/g, this.width)
			.replace(/#HEIGHT#/g, this.height);
		this.container.html(str);
	}

	createScaleGrid ()
	{
		let text;

		let distance = 10000 / this.scale;
		let startX = (this.position.x + (this.width >> 1) * this.scale) % (this.scale * distance) / this.scale;
		let startY = (this.position.y + (this.height >> 1) * this.scale) % (this.scale * distance) / this.scale;

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
		this.showStats();
	}

	showSpaceObjects ()
	{
		let text = '', length;
		for (let code in this.space.objects) {
			let object = this.space.objects[code].data;

			let objectX = (this.width >> 1) + (this.position.x + object.position.x) / this.scale;
			let objectY = (this.height >> 1) + (this.position.y + object.position.y) / this.scale;
			let objectR = Math.max(object.radius / this.scale, 5);

			length = Math.hypot(object.velocity.x, object.velocity.y, object.velocity.z);
			let sVelocityAngle = Math.acos(- object.velocity.y / length) * (180 / Math.PI);
			if (object.velocity.x < 0) sVelocityAngle = -sVelocityAngle;

			length = Math.hypot(object.acceleration.x, object.acceleration.y, object.acceleration.z);
			let sAccAngle = length > 0 ? Math.acos(- object.acceleration.y / length) * (180 / Math.PI) : 0;
			if (object.acceleration.x < 0) sAccAngle = -sAccAngle;

			text += '<g data-code="' + object.code + '">';

			if (object.symbol) {
				text += '<use xlink:href="#' + object.symbol + '" x="' + (objectX - 27/2) + '" y="' + (objectY - 60/2) + '" transform="rotate(' + sVelocityAngle + ' ' + objectX + ' ' + objectY + ')" />';
			} else {
				text +=   '<circle cx="' + objectX + '" cy="' + objectY + '" r="' + objectR + '"/>';
			}

			if (object.type == 'SHIP') {
				text += '<line x1="' + objectX + '" y1="' + objectY + '" x2="' + objectX + '" y2="' + (objectY - 100) + '" transform="rotate(' + sVelocityAngle + ' ' + objectX + ' ' + objectY + ')" stroke="green" stroke-width="1"/>';
				text += '<line x1="' + objectX + '" y1="' + objectY + '" x2="' + objectX + '" y2="' + (objectY - 100) + '" transform="rotate(' + sAccAngle + ' ' + objectX + ' ' + objectY + ')" stroke="red" stroke-width="1"/>';
			}

			text += '</g>';
		}
		$('.observerObjectes', this.container).html(text);
	}

	showStats ()
	{
		if (!this.statsContainer) return;

		let date = new Date() / 1000;

		this.statsContainer.find('.timeGlobal').html(Helper.TimeToString(date));
		this.statsContainer.find('.timeSpace').html(Helper.TimeToString(this.space.systemTime));
		this.statsContainer.find('.timeDelta').html(Helper.TimerToString(date - this.space.systemTime));
		this.statsContainer.find('.controltime').html(this.timeControl);
	}
}

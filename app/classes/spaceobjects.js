class SpaceObjects
{
	constructor (data)
	{
		data.symbol = data.hasOwnProperty('symbol') ? data.symbol : false;

		this.data = data;
		this.data.acceleration = { x: 0, y: 0, z: 0 };
		this.timer = 0;
		this.time = data.time;
		this.statsContainer = false;

		this.follow = data.hasOwnProperty('follow') ? data.follow : false;
		this._distances = {};

		this.trace = data.hasOwnProperty('trace') && data.trace ? [] : false;
		this.trace = [];
		this.traceLastTime = 0;
	}

	move (deltaTime)
	{
		var v0 = this.data.velocity;

		//this.data.velocity.x += deltaTime * this.data.acceleration.x;
		//this.data.velocity.y += deltaTime * this.data.acceleration.y;
		//this.data.velocity.z += deltaTime * this.data.acceleration.z;

		this.data.position.x += v0.x * deltaTime;// + this.data.acceleration.x * (deltaTime * deltaTime) / 2;
		this.data.position.y += v0.y * deltaTime;// + this.data.acceleration.y * (deltaTime * deltaTime) / 2;
		this.data.position.z += v0.z * deltaTime;// + this.data.acceleration.z * (deltaTime * deltaTime) / 2;

		this.timer += deltaTime;
		this.time += deltaTime;

		if (this.trace) {
			if (this.time >= this.traceLastTime + 60) {
				this.trace.push({
					t: this.time,
					pX: this.data.position.x,
					pY: this.data.position.y,
					pZ: this.data.position.z,
				});
				this.traceLastTime = this.time;
			}
		}

		if (this.statsContainer) {
			this.displayStats();
			console.log(this.trace);
		}
	}

	displayStats ()
	{
		this.statsContainer.find('.time').html(Helper.TimeToString(this.time));
		this.statsContainer.find('.timer').html(Helper.TimerToString(this.timer));
		this.statsContainer.find('.velocity').html(Helper.VectorLengthToString(this.data.velocity, 6));
		this.statsContainer.find('.acc').html(Helper.VectorLengthToString(this.data.acceleration, 9));

		if (this.follow) {
			let str = '';
			this.follow.forEach(value => {
				if (str != '') {
					str += '<br>';
				}
				str += this._distances[value];
			});
			this.statsContainer.find('.follow').html(str);
		}
	}
}

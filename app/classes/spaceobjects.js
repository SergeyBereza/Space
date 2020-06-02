class SpaceObjects
{
	constructor (data)
	{
		this.data = data;
		this.data.acceleration = { x: 0, y: 0, z: 0 };
		this.timer = 0;
		this.time = data.time;
		this.statsContainer = false;
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

		if (this.statsContainer) {
			this.displayStats();
		}
	}

	displayStats ()
	{
		this.statsContainer.find('.time').html(Helper.TimeToString(this.time));
		this.statsContainer.find('.timer').html(Helper.TimerToString(this.timer));
		this.statsContainer.find('.velocity').html(Helper.VectorLengthToString(this.data.velocity, 6));
		this.statsContainer.find('.acc').html(Helper.VectorLengthToString(this.data.acceleration, 9));
	}
}

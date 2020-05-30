class SpaceObjects
{
	constructor (data)
	{
		this.data = data;
	}

	move (deltaTime)
	{
		var v0 = this.data.velocity;

		this.data.velocity.x += deltaTime * this.data.acceleration.x;
		this.data.velocity.y += deltaTime * this.data.acceleration.y;
		this.data.velocity.z += deltaTime * this.data.acceleration.z;

		this.data.position.x += v0.x * deltaTime + this.data.acceleration.x * (deltaTime * deltaTime) / 2;
		this.data.position.y += v0.y * deltaTime + this.data.acceleration.y * (deltaTime * deltaTime) / 2;
		this.data.position.z += v0.z * deltaTime + this.data.acceleration.z * (deltaTime * deltaTime) / 2;
	}
}

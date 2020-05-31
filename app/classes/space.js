class Space
{
	static G = 6.6740831e-20;

	constructor ()
	{
		this.objects = {};
		this.systemTime = new Date() / 1000;

		let arData = [{
			'code': 'Earth',
			'name': 'Земля',
			'position': { x: 0, y: 0, z: 0 },
			'velocity': { x: 0, y: 0, z: 0 },
			'acceleration': { x: 0, y: 0, z: 0 },

			'radius': 6371.0,
			'weight': 5.97219e+24
		},{
			'code': 'Earth_Moon',
			'name': 'Луна',
			'position': { x: 384467, y: 0, z: 0 },
			'velocity': { x: 0, y: 0, z: 0 },
			'acceleration': { x: 0, y: 0, z: 0 },

			'radius': 1737.1,
			'weight': 7.3477e+22
		},{
			'code': 'Farefly',
			'name': 'Светлячок',
			'position': { x: 0, y: 6700, z: 0 },
			'velocity': { x: 8, y: 0, z: 0 },
			'acceleration': { x: 0, y: 0, z: 0 },

			'radius': 0,
			'weight': 1000
		}];

		arData.forEach((value, index, array) => {
			value.time = this.systemTime;
			this.objects[value.code] = new SpaceObjects(value);
		});
	}

	tick ()
	{
		let newTime = new Date() / 1000;
		let deltaTime = newTime - this.systemTime;

		for (let code in this.objects) {
			let mainObject = this.objects[code].data;

			for (let subCode in this.objects) {
				if (code == subCode) continue;

				let gravityObject = this.objects[subCode].data;
				let distance = {};
				let sDistance = 0;
				let acceleration = {};
				let sAcceleration = 0;

				distance.x = gravityObject.position.x - mainObject.position.x;
				distance.y = gravityObject.position.y - mainObject.position.y;
				distance.z = gravityObject.position.z - mainObject.position.z;
				sDistance = Math.sqrt(distance.x * distance.x + distance.y * distance.y + distance.z * distance.z);
				sAcceleration = Space.G * gravityObject.weight / (sDistance * sDistance);

				acceleration.x = sAcceleration * (distance.x / sDistance);
				acceleration.y = sAcceleration * (distance.y / sDistance);
				acceleration.z = sAcceleration * (distance.z / sDistance);

				mainObject.velocity.x += deltaTime * acceleration.x;
				mainObject.velocity.y += deltaTime * acceleration.y;
				mainObject.velocity.z += deltaTime * acceleration.z;
			}

			this.objects[code].move(deltaTime);
		}

		this.systemTime = newTime;
	}
}

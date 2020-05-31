class Helper
{
	static TimeToString (time)
	{
		let date = new Date(time * 1000);
		return date.toISOString().substr(0,19).replace('T', ' ');
	}

	static TimerToString (timer)
	{
		return timer;
	}

	static VectorLengthToString (vector) {
		let length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
		return length;
	}
}

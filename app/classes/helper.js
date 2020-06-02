class Helper
{
	static TimeToString (time)
	{
		let date = new Date(time * 1000);
		return date.toISOString().substr(0,19).replace('T', ' ');
	}

	static TimerToString (timer)
	{
		timer = Math.round(timer);
		let seconds = timer % 60;
		timer = (timer - seconds) / 60;
		let minutes = timer % 60;
		timer = (timer - minutes) / 60;
		let hours = timer % 24;
		let days = (timer - hours) / 24;

		if (seconds < 10) seconds = '0' + seconds;
		if (minutes < 10) minutes = '0' + minutes;
		if (hours < 10) hours = '0' + hours;
		if (days < 10) days = '00' + days;
		else if (days < 100) days = '0' + days;

		return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + days + ':' + hours + ':' + minutes + ':' + seconds;
	}

	static VectorLengthToString (vector, decimals = 0) {
		let length = Math.hypot(vector.x, vector.y, vector.z);
		if (decimals > 0) {
			length = length.toFixed(decimals);
		} else {
			length = length.toFixed();
		}
		return length;
	}
}

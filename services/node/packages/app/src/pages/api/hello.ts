import {HttpException, api} from '../../util/api';

// Type to be imported in the frontend
// for type-safe API routes
export interface HelloResponseType {
	time: number;
}

export default api<HelloResponseType>(async (req, res) => {
	if (Math.random() > 0.7) {
		throw new HttpException(400, 'This was intentionally thrown!');
	}

	res.json({
		time: Date.now(),
	});
});

import { hashSync } from 'bcrypt';
import { Users, IUser } from './models/Users';

const user: Omit<IUser, '_id'> = {
	email: 'hello@imperialb.in',
	password: hashSync('asdhjkasdhjk', 13),
	userId: 1,
	name: 'demo',
	betaCode: '12345',
	banned: false,
	apiToken: 'hello-world',
	icon: '',
	ip: '',
	confirmed: true,
	codes: ['yes'],
	codesLeft: 10,
	memberPlus: true,
	documentsMade: 10,
	settings: {
		clipboard: false,
		longerUrls: true,
		instantDelete: false,
		encrypted: false,
		expiration: 10,
		imageEmbed: true,
	},
};

new Users(user).save().then(() => {
	console.log('Initial user seeded');
});

export {};

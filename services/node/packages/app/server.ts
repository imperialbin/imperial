/* eslint-disable @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-confusing-void-expression,@typescript-eslint/non-nullable-type-assertion-style */

import {PrismaClient} from '@prisma/client';
import {createServer} from 'http';
import {blue, green, red} from 'colorette';
import next from 'next';
import {parse} from 'url';
import IORedis from 'ioredis';

const logPrefix = blue('app');

const dev = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT ?? '3000';

const app = next({dev});
const handle = app.getRequestHandler();

async function main() {
	// @ts-ignore
	globalThis.____redis____ = new IORedis(process.env.REDIS_URL, {
		lazyConnect: true,
	});

	console.log(`${logPrefix} - dev: ${dev ? 'yes' : 'no'}`);
	console.log(`${logPrefix} – database connecting`);

	// @ts-ignore
	globalThis.____prisma____ = new PrismaClient({log: ['info']});

	// @ts-ignore
	await globalThis.____prisma____.$connect();

	console.log(`${logPrefix} - connecting to redis`);

	// @ts-ignore
	await globalThis.____redis____.connect();

	console.log(`${logPrefix} - connected to redis`);

	console.log(`${logPrefix} – preparing next.js`);
	await app.prepare();

	console.log(`${logPrefix} – next.js prepared! ready to start accepting connections`);

	createServer(async (req, res) => {
		const start = Date.now();

		if (!req.url) {
			return res.end();
		}

		const parsedUrl = parse(req.url, true);
		await handle(req, res, parsedUrl);

		if (req.url.includes('/api/')) {
			const ip = (
				(typeof req.headers['x-forwarded-for'] === 'string' && req.headers['x-forwarded-for'].split(',').shift()) ||
				req.connection?.remoteAddress ||
				req.socket?.remoteAddress
			)?.toString() as string;

			const time = green((Date.now() - start).toString());

			console.log(`${logPrefix} - ${req.url ?? '?'} ${red(ip)} in ${time}ms`);
		}
	}).listen(parseInt(PORT), () => {
		console.log(`${logPrefix} - ready on :${PORT}`);
	});
}

void main();

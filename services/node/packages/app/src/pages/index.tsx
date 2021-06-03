import {Box, Heading, Kbd} from '@chakra-ui/layout';
import React, {useEffect, useState} from 'react';

// Ambient TypeScript import only
import type {HelloResponseType} from './api/hello';
import {APIErrorResponse, APIResponse} from '../util/api';

import * as imperial from '@imperial/components';

export default function Home() {
	const [data, setData] = useState<HelloResponseType | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		void fetch('/api/hello')
			.then(async res => {
				const json = (await res.json()) as APIResponse<HelloResponseType>;

				if (res.status >= 400) {
					const {message} = json as APIErrorResponse;
					throw new Error(message);
				}

				return json as HelloResponseType;
			})
			.then(setData)
			.catch(setError);
	}, []);

	return (
		<Box textAlign="center" paddingTop={5}>
			<Heading>Hello World</Heading>
			<imperial.Test />
			{error ? (
				<p>
					The API endpoint threw an error! <Kbd>{error.message}</Kbd>
				</p>
			) : (
				<p>
					Time according to <Kbd>/api/hello</Kbd>: {data ? data.time : 'Loading...'}
				</p>
			)}
		</Box>
	);
}

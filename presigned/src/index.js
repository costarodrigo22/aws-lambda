import { response } from './utils/response.js';
import crypto from 'node:crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function handler(event) {
	const { filename } = JSON.parse(event.body);

	if (!filename) {
		return response(400, {
			error: 'Filename is required.',
		});
	}

	const s3Client = new S3Client();
	const command = new PutObjectCommand({
		Bucket: 'rodrigo.costa.dev',
		Key: `uploads/${crypto.randomUUID()}-${filename}`,
	});

	const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

	return response(200, { url });
}

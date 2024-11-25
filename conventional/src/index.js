import parser from 'lambda-multipart-parser';
import { response } from './utils/response.js';
import crypto from 'node:crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function handler(event) {
	const {
		files: [file],
	} = await parser.parse(event);

	if (!file || file.fieldname !== 'file') {
		return response(400, {
			error: 'File is required.',
		});
	}

	if (file.contentType !== 'image/png') {
		return response(400, {
			error: 'Only png files are accepted',
		});
	}

	const s3Client = new S3Client();
	const command = new PutObjectCommand({
		Bucket: 'rodrigo.costa.dev',
		Key: `uploads/${crypto.randomUUID()}-${file.filename}`,
		Body: file.content,
	});

	const s3Response = await s3Client.send(command);

	return response(200, s3Response.body);
}

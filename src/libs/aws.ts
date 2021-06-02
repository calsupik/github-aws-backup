import assert from 'assert'
import { Readable } from 'stream'
import AWS from 'aws-sdk'

const DEFAULT_BUCKET = process.env.AWS_S3_BUCKET
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY

export const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
})

export async function uploadObject(
  name: string,
  data: Buffer | Readable | string
) {
  assert(DEFAULT_BUCKET, 'aws bucket should be set in environment variables')

  const params: AWS.S3.PutObjectRequest = {
    Bucket: DEFAULT_BUCKET,
    Key: name,
    Body: data,
  }

  const response = await s3.putObject(params).promise()

  return response
}

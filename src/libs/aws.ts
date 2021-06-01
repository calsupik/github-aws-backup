import assert from 'assert'
import { Readable } from 'stream'
import AWS from 'aws-sdk'

const DEFAULT_BUCKET = process.env.AWS_S3_BUCKET

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export async function uploadObject(
  name: string,
  data: Buffer | Readable | string
) {
  assert(DEFAULT_BUCKET, 'bucket should be set on default params')

  const params: AWS.S3.PutObjectRequest = {
    Bucket: DEFAULT_BUCKET,
    Key: name,
    Body: data,
  }

  const response = await s3.putObject(params).promise()

  return response
}

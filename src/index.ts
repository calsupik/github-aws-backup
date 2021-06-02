require('dotenv').config()
import fs from 'fs'
import tar from 'tar'
import { v4 as uuidv4 } from 'uuid'
import { uploadObject } from './libs/aws'
import { getOrgRepos, cloneRepo } from './libs/github'
;(async function ghaws() {
  try {
    const backupInstancePrefix = `${Date.now()}__${uuidv4()}`
    const fullPrefixBase = [
      process.env.AWS_S3_PREFIX || 'github',
      backupInstancePrefix,
    ]

    const repos = await getOrgRepos()

    for (const repo of repos) {
      console.log(`Starting backup for repo "${repo.name}"...`)
      if (fs.existsSync(`${repo.name}.git`))
        fs.rmSync(`${repo.name}.git`, { recursive: true })
      if (fs.existsSync(`${repo.name}.git.tar.gz`))
        fs.rmSync(`${repo.name}.git.tar.gz`)

      console.log(`Cloning repo "${repo.name}"...`)
      // https://github.com/steveukx/git-js
      await cloneRepo(repo.name, `${repo.name}.git`)

      console.log(`Compressing repo "${repo.name}"...`)
      // https://github.com/npm/node-tar
      tar.c({ gzip: true, sync: true, file: `${repo.name}.git.tar.gz` }, [
        `${repo.name}.git`,
      ])

      console.log(`Uploading repo "${repo.name}" to S3...`)
      const filePathInBucket = [...fullPrefixBase, `${repo.name}.git.tar.gz`]
      const fileData = fs.readFileSync(`${repo.name}.git.tar.gz`)
      await uploadObject(filePathInBucket.join('/'), fileData)

      if (fs.existsSync(`${repo.name}.git`))
        fs.rmSync(`${repo.name}.git`, { recursive: true })
      if (fs.existsSync(`${repo.name}.git.tar.gz`))
        fs.rmSync(`${repo.name}.git.tar.gz`)

      console.log(`Successfully backed up repo "${repo.name}"!`)
    }

    console.log(`Successfully backed up all repos to:`)
    console.log(`s3://${process.env.AWS_S3_BUCKET}/${fullPrefixBase.join('/')}`)
  } catch (err) {
    console.error(`Error processing repos`, err)
  } finally {
    process.exit()
  }
})()

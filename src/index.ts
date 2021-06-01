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
      console.log(`Backing up repo "${repo.name}" to S3...`)
      if (fs.existsSync(`${repo.name}.git`))
        fs.rmSync(`${repo.name}.git`, { recursive: true })
      if (fs.existsSync(`${repo.name}.git.tar.gz`))
        fs.rmSync(`${repo.name}.git.tar.gz`)

      // https://github.com/steveukx/git-js
      await cloneRepo(repo.name, `${repo.name}.git`)

      // https://github.com/npm/node-tar
      tar.c({ gzip: true, sync: true, file: `${repo.name}.git.tar.gz` }, [
        `${repo.name}.git`,
      ])

      const filePathInBucket = [...fullPrefixBase, `${repo.name}.git.tar.gz`]
      const fileData = fs.readFileSync(`${repo.name}.git.tar.gz`)
      await uploadObject(filePathInBucket.join('/'), fileData)

      if (fs.existsSync(`${repo.name}.git`))
        fs.rmSync(`${repo.name}.git`, { recursive: true })
      if (fs.existsSync(`${repo.name}.git.tar.gz`))
        fs.rmSync(`${repo.name}.git.tar.gz`)
    }

    console.log(`Successfully saved your repos to:`)
    console.log(`s3://${process.env.AWS_S3_BUCKET}/${fullPrefixBase.join('/')}`)
  } catch (err) {
    console.error(`Error processing repos`, err)
  } finally {
    process.exit()
  }
})()

import assert from 'assert'
import git from 'simple-git'

var GitHub = require('github-api')

const DEFAULT_ORG = process.env.GITHUB_ORG
const DEFAULT_USERNAME = process.env.GITHUB_USERNAME
const DEFAULT_TOKEN = process.env.GITHUB_TOKEN

export const gh = new GitHub({
  username: DEFAULT_USERNAME,
  token: DEFAULT_TOKEN,
})

export async function getOrgRepos() {
  assert(DEFAULT_ORG, 'github org should be set in environment variables')

  const org = await gh.getOrganization(DEFAULT_ORG)

  const { data, error } = await org.getRepos()

  if (error) throw new Error(error)

  return data
}

export async function cloneRepo(repo: string, target: string) {
  assert(DEFAULT_ORG, 'github org should be set in environment variables')
  assert(
    DEFAULT_USERNAME,
    'github username should be set in environment variables'
  )
  assert(DEFAULT_TOKEN, 'github token should be set in environment variables')

  // https://github.com/steveukx/git-js
  const remote = `https://${DEFAULT_USERNAME}:${DEFAULT_TOKEN}@github.com/${DEFAULT_ORG}/${repo}`
  const response = await git().clone(remote, target)

  return response
}

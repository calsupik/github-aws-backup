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
  assert(DEFAULT_ORG, 'org should be set on default params')

  const org = await gh.getOrganization(DEFAULT_ORG)

  const { data, error } = await org.getRepos()

  if (error) throw new Error(error)

  return data
}

export async function cloneRepo(repo: string, target: string) {
  assert(DEFAULT_ORG, 'org should be set on default params')
  assert(DEFAULT_USERNAME, 'username should be set on default params')
  assert(DEFAULT_TOKEN, 'token should be set on default params')

  // https://github.com/steveukx/git-js
  const remote = `https://${DEFAULT_USERNAME}:${DEFAULT_TOKEN}@github.com/${DEFAULT_ORG}/${repo}`
  const response = await git().clone(remote, target)

  return response
}

# Github to AWS Backup

Backup all GitHub repositories to an AWS S3 bucket.

## Install

```sh
$ npm install github-aws-backup
```

## Usage

Set required enviornment variables for GitHub and AWS,
as documented in [`.env.example`](https://github.com/calsupik/github-aws-backup/blob/master/.env.example),
in either an `.env` file or in your current terminal session. Enviornment variables are required for
authentication in both GitHub and AWS.

```sh
$ ghaws
```

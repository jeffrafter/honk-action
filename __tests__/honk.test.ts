import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import nock from 'nock'
import run from '../honk'

beforeEach(() => {
  jest.resetModules()

  process.env['GITHUB_REPOSITORY'] = 'example/repository'
  process.env['GITHUB_TOKEN'] = '12345'

  // https://developer.github.com/v3/activity/events/types/#issuecommentevent
  github.context.payload = {
    action: 'created',
    issue: {
      number: 1,
    },
    comment: {
      id: 1,
      user: {
        login: 'monalisa',
      },
      body: 'Honk',
    },
  } as WebhookPayload
})

describe('honk action', () => {
  it('runs', async () => {
    await expect(run()).resolves.not.toThrow()
  })

  it('deletes the comment and adds a comment', async () => {
    github.context.payload.comment.body = 'No geese allowed'

    // Delete comment
    nock('https://api.github.com')
      .delete('/repos/example/repository/issues/comments/1')
      .reply(200, {})

    // Honk
    nock('https://api.github.com')
      .post(`/repos/example/repository/issues/1/comments`, body => {
        return (
          body.body ===
          '![honk](https://user-images.githubusercontent.com/4064/65900857-cf462f80-e36b-11e9-9a9c-76170c99618b.png)'
        )
      })
      .reply(200, {
        url: 'https://github.com/#example',
      })

    await run()
  })
})

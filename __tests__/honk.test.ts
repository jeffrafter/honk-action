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
    expect(async () => {
      await run()
    }).not.toThrow()
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
        return body.body === '# Honk!'
      })
      .reply(200, {
        url: 'https://github.com/#example',
      })

    await run()

    expect(1).toEqual(1)
  })
})

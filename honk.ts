import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
  try {
    const token = process.env['HONK_USER_TOKEN'] || process.env['GITHUB_TOKEN']
    if (!token) return

    // Create the octokit client
    const octokit: github.GitHub = new github.GitHub(token)
    const nwo = process.env['GITHUB_REPOSITORY'] || '/'
    const [owner, repo] = nwo.split('/')
    const issue = github.context.payload['issue']
    if (!issue) return

    const comment = github.context.payload.comment
    const commentBody = comment.body
    if (commentBody.match(/honk/i)) return

    // Delete the comment
    // https://octokit.github.io/rest.js/#octokit-routes-issues-delete-comment
    const deleteCommentResponse = await octokit.issues.deleteComment({
      owner,
      repo,
      comment_id: comment.id,
    })
    console.log(`Deleted comment! ${JSON.stringify(deleteCommentResponse.data)}`)

    // Add a new comment that says honk
    // https://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
    const issueCommentResponse = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issue.number,
      body: '# Honk!',
    })
    console.log(`Honk! ${issueCommentResponse.data.url}`)
  } catch (error) {
    console.error(error.message)
    core.setFailed(`Honk-action failure: ${error}`)
  }
}

run()

export default run

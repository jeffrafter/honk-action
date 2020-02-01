![sign](https://user-images.githubusercontent.com/4064/65901610-665fb700-e36d-11e9-9659-c65e623565cb.png)

A bot which requires all comments to contain 'honk' or it deletes them.

![honk](https://user-images.githubusercontent.com/4064/65900857-cf462f80-e36b-11e9-9a9c-76170c99618b.png)

To use this bot add the following workflow to your repo at `.github/workflows/honk.yml`:

```yml
name: Honk workflow
on:
  issue_comment:
    types: [created]

jobs:
  build:
    name: Honk
    runs-on: ubuntu-latest
    steps:
      - uses: jeffrafter/honk-action@v1
```

To see this in use, checkout [honk-test](https://github.com/jeffrafter/honk-test/issues).

## Development

Clone this repo. Then run tests:

```bash
npm test
```

And lint:

```
npm run lint
```

If you want to release a new version first checkout or create the release branch

```
git checkout releases/v1
```

Then create the release:

```bash
git reset --hard master
npm test
npm run lint
npm run build
git add .
git commit -m "v1"
git push origin releases/v1
git push origin :refs/tags/v1
git tag -fa v1 -m "v1"
git push origin v1
```

# Credits

Inspired by [Untitled Goose Game](https://goose.game/) and the Discord bot by [@melissamcewen](https://twitter.com/melissamcewen/status/1176980019811405824)

Note: not associated/affiliated with Unititled Goose Game in any way.

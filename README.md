A bot which requires all comments to be 'Honk' or it deletes them

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
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

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

Then build the distribution (requires compiling the TypeScript), drop the node modules and reinstall only the production node modules, commit and push the tag:

```bash
npm install
npm run build
rm -rf node_modules
sed -i '' '/node_modules/d' .gitignore
npm install --production
git add .
git commit -m "V1"
git push origin releases/v1
git push origin :refs/tags/v1
git tag -fa v1 -m "V1"
git push origin v1
```

Once complete you'll likely want to remove the production node modules and reinstall the dev dependencies.

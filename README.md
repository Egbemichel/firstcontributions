# Your first open source contribution 🇨🇲

Make your first open source contribution by adding yourself to the
**[OSS Cameroon contributors page](https://osscameroon.github.io/firstcontributions/)**.
After that, your profile there can list the issues and pull requests you work on, in any open source project.

You only need a [GitHub account](https://github.com/signup). Everything happens on the GitHub website,
so you don't need to install anything or use the command line.

## Add yourself (about 5 minutes)

1. **[Click here to create your file](https://github.com/osscameroon/firstcontributions/new/main/contributors?filename=YOUR-GITHUB-USERNAME.yml&value=github%3A+YOUR-GITHUB-USERNAME%0Aname%3A+Your+Name%0A%23+The+lines+below+are+optional.+Replace+the+example+values+or+delete+the+lines.%0Abio%3A+A+short+sentence+about+you.%0Alocation%3A+Your+city%2C+Country%0Awebsite%3A+https%3A%2F%2Fexample.com%0Acontributions%3A%0A++%23+Later%2C+list+issues+or+pull+requests+you+worked+on%2C+one+per+line%2C+like+this%3A%0A++%23+-+https%3A%2F%2Fgithub.com%2Fosscameroon%2Fjs-generator%2Fpull%2F1%0A).**
   GitHub opens an editor with a file that's already filled in with example values.
   You can also type your username on [the website](https://osscameroon.github.io/firstcontributions/) and
   click **Add me**, which fills in your username for you.
2. **Name the file after your GitHub username.** In the box at the top, replace `YOUR-GITHUB-USERNAME` with your username,
   for example `contributors/octocat.yml`. Keep the `.yml` at the end.
3. **Fill in your details.** Replace the example values with your own. Only `github` and `name` are required, so delete the
   lines you don't want:

   ```yaml
   github: octocat
   name: Mona Lisa Octocat
   bio: I build web apps and I'm learning Go.
   location: Yaoundé, Cameroon
   website: https://octocat.dev
   contributions:
   ```

4. **Click the green _Commit changes…_ button, then _Propose changes_.** GitHub makes your own copy of the project
   (a _fork_) and saves your file there.
5. **Click _Create pull request_** twice. That's your first contribution 🎉

A bot checks your file within a minute and leaves a comment on your pull request. If something needs fixing, the comment
tells you what to change and how. After your pull request is merged, your profile appears on the website
a few minutes later.

## List your open source contributions

Each time you open an issue or a pull request in an open source project, you can add it to your profile:

1. Open your file: `https://github.com/osscameroon/firstcontributions/blob/main/contributors/<your-username>.yml`
   (or click **Is this you? Add a contribution** on your profile page).
2. Click the ✏️ pencil icon to edit it.
3. Add the link under `contributions:`, on its own line, starting with two spaces and a dash:

   ```yaml
   contributions:
     - https://github.com/osscameroon/js-generator/pull/42
     - https://github.com/nodejs/node/issues/12345
   ```

4. Click **Commit changes…**, then **Propose changes**, then **Create pull request**.

The website shows each item's title and whether it is open, merged or closed, and updates every day.

## Fields

| Field           | Required | Description                                                       |
| --------------- | -------- | ----------------------------------------------------------------- |
| `github`        | yes      | Your GitHub username. It must match the file name.                |
| `name`          | yes      | Your name, up to 80 characters.                                   |
| `bio`           | no       | A short sentence about you, up to 280 characters.                 |
| `location`      | no       | Where you are, e.g. `Douala, Cameroon`.                           |
| `website`       | no       | A link starting with `https://`.                                  |
| `contributions` | no       | Links to GitHub issues or pull requests you worked on, one per line. |

## Common problems

- **"You can only add or edit your own file"**: the file name must be your GitHub username, e.g. `contributors/octocat.yml`.
- **"not valid YAML"**: each line must look like `field: value`. Each item in `contributions` must start with two spaces
  and a dash: `  - https://...`.
- **The file isn't in the `contributors` folder**: delete it and start again from the link in step 1.

To fix your pull request, open its **Files changed** tab, click **⋯** next to your file, then **Edit file**.

Stuck? Ask for help in a comment on your pull request. Someone from the community will help you.

---

## For maintainers

- **Website:** `npm run build` generates a static site in `dist/` from `contributors/*.yml`. The
  [deploy workflow](.github/workflows/deploy.yml) publishes it to GitHub Pages on every push to `main`, and once a day to
  refresh issue and pull request statuses. In _Settings → Pages_, set **Source** to **GitHub Actions**.
- **Pull request checks:** [check-contribution.yml](.github/workflows/check-contribution.yml) validates the changed files and
  comments with the result. It uses `pull_request_target`, so it runs on first-time contributors' pull requests without
  approval. For that reason it only parses the pull request's YAML files and never runs code from them. Keep it that way.
  Contributors can only change their own file; members and collaborators can change any file.
- **Auto-merge (optional):** set the repository variable `AUTO_MERGE` to `true` (_Settings → Secrets and variables →
  Actions → Variables_) to merge valid pull requests that only change the author's own contributor file. Turn on
  _Settings → Actions → General → Allow GitHub Actions to create and approve pull requests_ if merging fails.
- **Configuration:** the community name, repository and website URL are in [site.config.mjs](site.config.mjs).
  If you change the repository, update the link in step 1 (`npm test` reports when it's out of date).

### Develop locally

```sh
npm install
npm test                 # unit tests + checks every contributor file
npm run build:offline    # build without calling the GitHub API
npm run build            # build with issue/PR titles (set GITHUB_TOKEN to avoid rate limits)
python3 -m http.server -d dist 8000
```

# The docs-theme quickstart template

This project provides a minimal template for code.siemens.io websites using the Siemens MkDocs theme:

* Basic MkDocs configuration including the Siemens `docs-theme`
* Website deployment using Gitlab Pages
* Review deployment for visual feedback in Merge Requests
* _(optional)_: basic [renovate](https://docs.renovatebot.com/) configuration to keep your project fresh (requires setup)

## Create a new project

Follow the link below to create a new MkDocs project based on this template:

1. [Fork this repository](https://code.siemens.com/code-examples/docs-theme-quickstart/-/forks/new).

1. Once you've created the project, go to your project settings to
   [remove the fork relationship](https://docs.gitlab.com/ee/user/project/settings/#removing-a-fork-relationship).

   In your project's left sidebar, go **Settings > General > Advanced** and expand the section:

   <!-- We use uploads here so that assets don't end up in the users' repo -->
   ![Project advanced settings](https://code.siemens.com/code-examples/docs-theme-quickstart/uploads/964e5ec32dd4d610a7d93b392b591773/project-settings-advanced.png)

1. Scroll down and click on **Remove fork relationship**:

   ![Remove fork](https://code.siemens.com/code-examples/docs-theme-quickstart/uploads/b55141bb592d043352a66183068aab21/project-settings-remove-fork.png)

   > **Note**: You must have Owner permissions of the forked project to be able to remove the fork
   > relationship. If someone else forked the project and you are doing this after the fact, you
   > might not be able to see this option in your project settings.

## First use

If you want to see your GitLab Pages before making any changes, you need to trigger the pipeline one time to get it deployed.  
In your project's left sidebar, go to **CI/CD > Pipelines** and press the `Run pipeline` button.

If the pipeline passed with `Job succeeded`, you can find the URL under **Settings > Pages**  in the `Access pages` field. 

From now on, you can start editing your documentation and deploy your site using Siemens branding.

## Building locally

To work locally with this project, you'll have to follow the steps below:

1. Fork, clone or download this project
1. Install [Python](https://www.python.org/) and [Python Poetry](https://python-poetry.org/)

1. Configure poetry login credentials to work with code.siemens.com. 
   You will need a personal access token for your account.
   You can learn how to create one in the [Personal Access Tokens](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token) documentation.

   After you have a token (it will start with `CSC-`)
   you have to configure the registry authentication. Run this in command line

   ```shell-session
   poetry config http-basic.mkdocs __token__ <your token>
   ```

1. Install dependencies: `poetry install --no-root`
1. Preview your project: `poetry run mkdocs serve`, then available at `http://127.0.0.1:8000`
1. Modify content, live reloading will reflect your changes immediately
1. Generate the website: `poetry run mkdocs build` (optional)

## Learn more

Visit [Siemens docs-theme](https://code.siemens.com/code-ops/docs-theme/) for the full documentation
and the [MkDocs documentation](https://www.mkdocs.org/) if you'd like to learn more about the technology
behind our theme.

### Contributing

We love :heart: contributions!

Use the issue tracker to document bugs or missing features.

Contribute by using the [merge request
workflow](https://docs.gitlab.com/ce/development/contributing/merge_request_workflow.html).

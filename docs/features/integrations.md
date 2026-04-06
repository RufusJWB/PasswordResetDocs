# Integrations

## OpenAPI inline rendering

Enable the inline rendering of [OpenAPI specs](https://www.openapis.org/) in `mkdocs.yml`:

```yaml
theme:
  features:
    - openapi
```

Add a `div` element for every OpenAPI specification with the following attributes:

- The CSS `class` should be `material-openapi`
- The `data-openapi-url` attribute should be the URL to your specification

Example:

```markdown
# OpenAPI Specification

A very cool API 🔥

<div class="material-openapi" data-openapi-url="https://example.com/specs/cool-api.yml"></div>
```

#### Try-it-out

To allow people to use the try-it-out functionality of the OpenAPI UI, simply
set the `data-try-it-out-btn` attribute to `true`:

```html
<div
  class="material-openapi"
  data-try-it-out-btn="true"
  data-openapi-url="https://example.com/specs/cool-api.yml"
></div>
```

### Authentication

If your API also supports authentication and the try-it-out functionality has to
submit certain credentials, enable the OpenAPI UI authentication capability by
setting the `data-authorize-btn` attribute to `true`:

```html
<div
  class="material-openapi"
  data-try-it-out-btn="true"
  data-authorize-btn="true"
  data-openapi-url="https://example.com/specs/cool-api.yml"
></div>
```

#### Authentication using OAuth2

The OpenAPI integration supports configuring
[OAuth2 authentication](https://swagger.io/docs/specification/authentication/oauth2).
Note that MkDocs will redirect the user back to the bundled `oauth2-redirect.html` template served at the project
root as part of the flow.

#### Customizing requests

Some authentication methods require setting payload or headers currently not supported by Swagger UI.
You can customize your requests to achieve this by providing your own function that takes a `request`
argument and setting its name as the `data-custom-request-function` attribute.

For example, in the snippet below we define a `customizeRequest` function that sends the `audience` field
in the payload when connecting to the token exchange endpoint:

```html
<script>
  function customizeRequest(request) {
    if (request.method === "post" && request.url.endsWith("/oauth/token")) {
      const body = new URLSearchParams(request.body);
      body.append("audience", "https://example.com");
      request.body = body.toString();
      }
    return request;
  }
</script>

<div
  class="material-openapi"
  data-try-it-out-btn="true"
  data-authorize-btn="true"
  data-custom-request-function="customizeRequest"
  data-openapi-url="https://example.com/specs/cool-api.yml"
></div>
```

## AsyncAPI inline rendering

Enable the [AsyncAPI](https://www.asyncapi.com/) rendering feature in your `mkdocs.yml`:

```yaml
theme:
  features:
    - asyncapi
```

Add a `div` element for your AsyncAPI specification with the following attributes:

- The CSS `class` should be set to `material-asyncapi`.
- The value of the `data-asyncapi-url` attribute contains the URL to your specification.

You can add one `div` per markdown file. Multiple specifications per page are not supported.

Example:

```html
<div
  id="asyncapi"
  class="material-asyncapi"
  data-asyncapi-url="https://example.com/specs/asyncapi.yaml"
>
</div>
```

### Sections

By default, all sections are rendered.  
However, you can disable the ones you do not want to be rendered. The example below would not render anything:

```html
<div
  id="asyncapi"
  class="material-asyncapi"
  data-asyncapi-url="https://example.com/specs/asyncapi.yaml"
  data-asyncapi-sidebar=false
  data-asyncapi-info=false
  data-asyncapi-servers=false
  data-asyncapi-operations=false
  data-asyncapi-messages=false
  data-asyncapi-schemas=false
  data-asyncapi-errors=false
>
</div>
```

### Expand sections

By default, `messageExamples` sections are not expanded in the AsyncAPI component.
However, you can enable this using `data-asyncapi-expand-message-examples`:

```html
<div
  id="asyncapi"
  class="material-asyncapi"
  data-asyncapi-url="https://example.com/specs/asyncapi.yaml"
  data-asyncapi-expand-message-examples=true
>
</div>
```

### Left sidebar navigation configuration

The AsyncAPI integration allows configuring the sidebar navigation to show Operations and Servers.

#### Show Operations

The following options are available with the `data-asyncapi-show-operations` parameter:

##### bySpecTags

Adds a level to the navigation under `Operations` with the tags from your overall
specification.

##### byOperationsTags

Adds a level to the navigation under `Operations` with the tags from the operations
object in your spec.

##### byDefault

No level with tags is added to the navigation.

#### Show servers in sidebars

The following options are available with the `data-asyncapi-show-servers` parameter:

##### bySpecTags

Adds a level to the navigation under `Servers` with the tags from your overall
specification.

##### byServersTags

Adds a level to the navigation under `Servers` with the tags from the operations
object in your spec.

##### byDefault

No level with tags is added to the navigation.

#### Example

```html
<div
  id="asyncapi"
  class="material-asyncapi"
  data-asyncapi-url="https://example.com/specs/asyncapi.yaml"
  data-asyncapi-show-operations="byDefault"
  data-asyncapi-show-servers="byDefault"
>
</div>
```

## Rendering local API specs

You can render API specs shipped with your deployed pages by using relative URLs.
Because you need to link to the API spec in relation to the deployed HTML page after the build and not
not in relation to the source Markdown file, the relative URLs you need to use differ slightly based on the
[`use_directory_urls`](https://www.mkdocs.org/user-guide/configuration/#use_directory_urls) option.

To cover all use cases, including review apps in merge requests, use the configuration below.

!!! hint
    This assumes your `.yaml` file is located at the same level as your markdown page. If the
    spec is located at a different location, adjust the relative `'../'` prefix accordingly.

First, make sure you install the [macros](https://mkdocs-macros-plugin.readthedocs.io) plugin
and enable it:

```yaml title="mkdocs.yml"
plugins:
  - search
  - macros
```

Then, include the conditional macros when adding the specification.

For OpenAPI specs:

```html
<div
  class="material-openapi"
  data-openapi-url="{{ '../' if config['use_directory_urls'] }}openapi.yaml"
>
</div>
```

For AsyncAPI specs:

```html
<div
  id="asyncapi"
  class="material-asyncapi"
  data-asyncapi-url="{{ '../' if config['use_directory_urls'] }}asyncapi.yaml"
>
</div>
```

You can see more examples of this in our
[end-to-end test resources](https://code.siemens.com/code-ops/docs-theme/-/tree/main/cypress/resources/docs/api).

## PlantUML rendering

By installing the [plantuml-markdown](https://github.com/mikitex70/plantuml-markdown) extension,
you can render PlantUML and C4PlantUML using the code.siemens.com PlantUML and kroki servers. To
ensure the diagrams are correctly themed in the light and dark scheme, you have to configure the
extension to render diagrams as inline SVG. For example:

```yaml title="mkdocs.yml"
markdown_extensions:
  - plantuml_markdown:
      server: https://code.siemens.com/api/kroki/plantuml
      format: svg_inline
      remove_inline_svg_size: false
```

You can then use the `plantuml` directive in your Markdown files:

````
  ```plantuml
  title "Messages - Sequence Diagram"

  actor User
  boundary "Web GUI" as GUI
  control "Shopping Cart" as SC
  entity Widget
  database Widgets

  User -> GUI : To boundary
  GUI -> SC : To control
  SC -> Widget : To entity
  Widget -> Widgets : To database
  ```
````


!!! note 
    Brand styles are applied on the SVG diagrams after they have been rendered by PlantUML. This
    means our theme may override some of the custom colors you define in your PlantUML code.

Diagrams will then display using the appropriate light or dark scheme on your deployed page:

```plantuml
title "Messages - Sequence Diagram"

actor User
boundary "Web GUI" as GUI
control "Shopping Cart" as SC
entity Widget
database Widgets

User -> GUI : To boundary
GUI -> SC : To control
SC -> Widget : To entity
Widget -> Widgets : To database
```

## Material for MkDocs Insiders

If you have been a user of MkDocs Insiders, the official documentation now recommends switching to the community edition as soon as possible,
as it includes all Insiders features.

If you use `docs-theme` and you want to make sure you benefit from all of the Insiders features, you
should upgrade or install `mkdocs-code-siemens-code-docs-theme` by specifying a version `>=8.0.0`.

### Using uv

Declare the `mkdocs` index in your `pyproject.toml` file:

```toml
[[tool.uv.index]]
name = "mkdocs"
url = "https://code.siemens.com/api/v4/projects/64538/packages/pypi/simple/"
explicit = true

[tool.uv.sources]
mkdocs-code-siemens-code-docs-theme = { index = "mkdocs" }
```

Before running `uv add "mkdocs-code-siemens-code-docs-theme>=8.0.0"`.

### Using poetry

```sh
poetry source add --priority=explicit docs-theme \
  https://code.siemens.com/api/v4/projects/64538/packages/pypi/simple/
poetry add --source docs-theme "mkdocs-code-siemens-code-docs-theme>=8.0.0"
```

### Using plain pip (not recommended)

```sh
python3 -m pip install "mkdocs-code-siemens-code-docs-theme>=8.0.0" \
  -i https://code.siemens.com/api/v4/projects/64538/packages/pypi/simple
```

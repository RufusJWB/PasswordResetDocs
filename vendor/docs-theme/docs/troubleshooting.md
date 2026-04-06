# Troubleshooting

## `full_page` front matter option not working

This option is not supported anymore. Please see the [hide sidebars](features/index.md#hide-the-sidebars-from-a-markdown-file)
section in the README for instructions on how to achieve the same result.

Please refer to [404 page](features/index.md#404-page).

## 404 page not showing up

Please refer to [404 page](features/index.md#404-page).

## 404 page does not render properly

MkDocs creates links on the 404 page based on your `site_url` configuration.
Make sure that your `site_url` matches the final URL of the deployed pages,
so that root-relative links match the location of deployed assets.

This also affects pages deployed to multiple domains or locations.
It is likely that only the canonical deployment defined in `site_url` will
properly render 404 pages if the locations differ. As a workaround, you can
provide your own custom `404.html` page to have control over asset linking.

See the [upstream docs](https://www.mkdocs.org/user-guide/configuration/#site_url) for more information.

## Uncaught ReferenceError: base_url is not defined

Add the below to your `mkdocs.yml`:
```yaml
theme:
  include_search_page: false
  search_index_only: true
```

## Tried to write more data than Content-Length

```shell
Uncaught exception GET /search/search_index.js (127.0.0.1)
    HTTPServerRequest(protocol='http', host='127.0.0.1:8000', method='GET', uri='/search/search_index.js', version='HTTP/1.1', remote_ip='127.0.0.1')
    Traceback (most recent call last):
      File "/home/user/.local/lib/python3.9/site-packages/tornado/web.py", line 1704, in _execute
        result = await result
      File "/home/user/.local/lib/python3.9/site-packages/tornado/web.py", line 2648, in get
        await self.flush()
      File "/home/user/.local/lib/python3.9/site-packages/tornado/web.py", line 1102, in flush
        return self.request.connection.write(chunk)
      File "/home/user/.local/lib/python3.9/site-packages/tornado/http1connection.py", line 499, in write
        self._pending_write = self.stream.write(self._format_chunk(chunk))
      File "/home/user/.local/lib/python3.9/site-packages/tornado/http1connection.py", line 475, in _format_chunk
        raise httputil.HTTPOutputError(
    tornado.httputil.HTTPOutputError: Tried to write more data than Content-Length
```

If you encounter an exception like the above, you probably have an old version of mkdocs in place.

Upgrade to a newer version. For example, if you are using [`uv`](https://docs.astral.sh/uv):

```shell
uv lock --upgrade-package mkdocs
```

## Search has disappeared

You maybe added another plugin and overwrote the by default enabled search plugin.
You can enable both by adding the following to `mkdocs.yml`:

```yaml
plugins:
  - search
  - your-other-plugin
```

Please see the [MkDocs documentation](https://www.mkdocs.org/user-guide/configuration/#plugins)
for further details.

## Mobile navigation is not shown on the start page

Instead, the entire page is dimmed, but nothing happens. The navigation is displayed on all other pages
(see [issue 85](https://code.siemens.com/code-ops/docs-theme/-/issues/85)).

If this happens in your documentation, and you have a customized landing page,
for example with a `brand-banner.html`, then please search and remove this instruction from that file:

```jinja2
{% block site_nav %}{% endblock %}
```

Alternatively, you can hide the sidebars from individual markdown files:
[described here](features/index.md#hide-the-sidebars-from-a-markdown-file).


## Links to OpenAPI, AsyncAPI specs and other assets are broken in previews or builds

Relative links to your site's resources resolve differently depending on how
you configure MkDocs' [`use_directory_urls`](https://www.mkdocs.org/user-guide/configuration/#use_directory_urls) option.

To avoid this, you can ensure you consistently use the configuration option across all your builds
or follow our guide in the [Integrations section](features/integrations.md#rendering-local-api-specs).

## Links point to the wrong navigation item when referring to the same file multiple times

This is a known limitation with MkDocs and is by design to avoid rebuilding the same file multiple times.
See this [upstream issue](https://github.com/mkdocs/mkdocs/issues/1974) for more details.

Use symbolic links to refer to the same file multiple times or copy them during your build
if you need to preserve the navigation structure.

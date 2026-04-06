FROM python:3.14@sha256:7aea6827c8787754f99339ffed8cfc41fb09421f9c7d0e77a198b08422a3455e

# Copy source files
COPY ./dist /dist
COPY ./cypress/resources /e2e
COPY ./cypress/resources/docker-entrypoint.sh /usr/local/bin/

# Set working directory
WORKDIR /e2e

# Install dependencies
RUN pip install --no-cache-dir -r requirements-dev.txt
# Install theme
RUN python3 -m pip install --no-cache-dir -f /dist/ "mkdocs-code-siemens-code-docs-theme[licenses]" -v

# Expose MkDocs development server port (all features suite)
EXPOSE 8000
# Expose MkDocs development server port (minimal suite)
EXPOSE 8001

# Start development server by default
ENTRYPOINT ["docker-entrypoint.sh"]

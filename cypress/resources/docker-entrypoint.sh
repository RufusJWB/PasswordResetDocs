#!/bin/bash

mkdocs serve --config-file=mkdocs.yml --dev-addr=0.0.0.0:8000 &
mkdocs serve --config-file=mkdocs-minimal.yml --dev-addr=0.0.0.0:8001

#!/bin/bash
cd /home/kavia/workspace/code-generation/elegant-tailor-studio-website-152337-152366/tailor_studio_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi


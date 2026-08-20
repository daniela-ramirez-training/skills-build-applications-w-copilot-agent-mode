# OctoFit Tracker frontend

The React 19 presentation tier uses React Router for navigation and calls the API tier at `/api/[component]/`.

## Environment

In a Codespaces environment, `VITE_CODESPACE_NAME` must be defined in `.env.local` so Vite can build API URLs such as `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Restart the Vite dev server after changing `.env.local`. When the variable is unset, the frontend uses relative `/api/...` URLs, which avoids generating an unsafe `https://undefined-8000...` URL and supports a locally proxied API.

## Commands

Run `npm run dev --prefix octofit-tracker/frontend` for development, `npm run build --prefix octofit-tracker/frontend` to build, and `npm run lint --prefix octofit-tracker/frontend` to lint.

# Hooksy

<div align="center">
  <img src="public/hooksy-icon.svg" alt="Hooksy Logo" width="120" height="120">
  <p>elegant way to send discord webhooks</p>
  <a href="https://hooksy.xyz">hooksy.app</a>
  
  <p>
    <a href="https://discord.com/developers/docs/resources/webhook">discord webhook docs</a> •
    <a href="https://github.com/your-username/hooksy">github</a>
  </p>
</div>

Hooksy is a Discord webhook sender that doesn't get in your way. It's clean, efficient, and focused on delivering your messages without unnecessary complexity.

Paste your JSON, add your webhook URL, preview your message, and send. That simple.

## Features

- Clean, dark monochrome interface
- Real-time JSON validation
- Live message preview
- Drag & drop JSON file support
- No data collection, no tracking, fully client-side
- Progressive Web App (PWA) support

## Development

This project uses:
- React for the UI
- Vite as the build tool
- Express for the API layer (when not deployed serverless)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deploying

Hooksy supports deployment to Netlify with serverless functions to protect your webhook requests.

See `netlify.toml` and `netlify/functions/webhook.js` for deployment configuration.

## License

MIT

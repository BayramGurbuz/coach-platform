# Clear Ratings (localStorage)

This file contains a small JavaScript snippet you can run in your browser's developer console to remove all rating-related keys stored in localStorage for this app.

Steps:

1. Open the app in your browser (e.g. `http://localhost:5173` or where your dev server runs).
2. Open DevTools (F12) → Console.
3. Paste the code below and press Enter.
4. Refresh the page.

JavaScript to run in the Console:

```javascript
// Remove rating-related localStorage keys used by the app
const keys = Object.keys(localStorage).filter(k => (
  k.startsWith('site_') ||
  k.startsWith('coach_') ||
  k.includes('ratings') ||
  k.includes('rating')
));
keys.forEach(k => localStorage.removeItem(k));
console.log('Removed localStorage keys:', keys);

// Optionally, reload the page to see changes
// location.reload();
```

Common keys this will remove:

- `site_user_rating`, `site_rating_count`, `site_ratings_list`
- `coach_user_rating_<coachId>`, `coach_ratings_<coachId>`

If you want me to add a temporary "Clear ratings" admin button inside the app instead, tell me and I'll add it to `client/src/components` and wire it into the admin or landing page for convenience.

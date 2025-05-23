const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Home route to confirm bot is running
app.get('/', (req, res) => {
  res.send('CHRISSPARK-XMD bot is live!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

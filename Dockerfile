# Install media tools
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg imagemagick webp && apt-get clean

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy app code
COPY . .

# Optional: Expose port if your bot runs a web server
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the bot
CMD ["npm", "start"]

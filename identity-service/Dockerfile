# 1️⃣ Base image (Node environment)
FROM node:18-alpine

# 2️⃣ Set working directory inside container
WORKDIR /use/src/app

# 3️⃣ Copy package.json and install dependencies 
COPY package*.json ./
# Run the command for only production not for dev dependencies 
RUN npm ci --only=production

# 4️⃣ Copy rest of the app files
COPY . . 

# 5️⃣ Expose the port (e.g., 5001)
EXPOSE 3001

# 6️⃣ Start the app
CMD ["node" "src/server.js"]

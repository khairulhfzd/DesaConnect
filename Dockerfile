# --- Stage 1: Build Frontend (React Vite) ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Final Image (Node.js Express) ---
FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source
COPY backend/ ./backend/

# Copy frontend build results to backend/public
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Expose port
EXPOSE 5000

# Start command
WORKDIR /app/backend
CMD ["node", "index.js"]

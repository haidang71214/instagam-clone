# Sử dụng Node.js nhẹ
FROM node:20-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json / package.json + devDependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Expose port backend đang dùng (index.js đang listen port nào thì expose port đó)
EXPOSE 8080

# Command chạy backend
CMD ["npm", "run", "start"]

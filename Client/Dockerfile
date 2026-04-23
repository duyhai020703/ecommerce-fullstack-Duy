# Dùng Node 20 thay vì 18 để tương thích với ES Module của Angular mới
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependency (thêm --force để tránh lỗi xung đột phiên bản nhỏ)
RUN npm install --force

# Copy toàn bộ code
COPY . .

# Build Angular
RUN npx ng build --configuration production

# Giai đoạn 2: Nginx
FROM nginx:alpine

# Copy code đã build vào (nhớ đường dẫn /browser Duy đã tìm thấy)
COPY --from=build /app/dist/Client/browser /usr/share/nginx/html

# COPY FILE CẤU HÌNH VỪA TẠO VÀO ĐÂY
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
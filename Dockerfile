# Gunakan Node.js versi 18 sebagai basis image
FROM node:18

# Atur direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Ekspos port 8080
EXPOSE 8080

# Tentukan perintah untuk menjalankan aplikasi
CMD ["node", "server.js"]

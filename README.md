Instagram Clone

A web-based Instagram-like app, built with Node.js, Express, and React.js. It allows users to upload photos, log in with Facebook, and interact securely with state managed by reducers.

🚀 Features





📸 Photo Upload – Upload images to Cloudinary.



🎉 Facebook Login – Authenticate using Facebook.



🔐 Authentication – Secure access with asymmetric cryptography (RSA/ECDSA).



❤️ Post Interaction – Like and comment on posts with state managed by reducers.

🛠️ Tech Stack





Frontend: React.js, TypeScript, TailwindCSS, Redux (with reducers)



Backend: Node.js, Express.js



ORM: Prisma



Database: MySQL (via Docker)



Authentication: JWT with asymmetric keys, Facebook OAuth



Image Upload: Cloudinary



Tools: Docker, Git, Postman

📂 Project Structure

instagram-clone/
├── backend/                # Express + MySQL server
│   ├── src/               
│   │   ├── auth/           # Authentication (Facebook, asymmetric keys)
│   │   ├── posts/          # Post-related logic
│   │   ├── cloudinary/     # Cloudinary image handling
│   │   ├── app.controller.ts  # Controller
│   │   ├── app.module.ts      # Module
│   │   ├── app.service.ts     # Service
│   │   └── main.ts           # App entry point
│   ├── prisma/             # Prisma schema and migrations
│   ├── docker-compose.yml  # Docker config for MySQL
│   ├── .env                # Environment variables
│   ├── package.json        # Package file
│   └── tsconfig.json       # TypeScript config
├── frontend/               # React.js app
│   ├── src/               
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Pages (Home, Profile, etc.)
│   │   ├── services/       # API calls
│   │   ├── redux/          # Redux store and reducers
│   │   │   ├── slices/     # Reducer slices (e.g., posts, auth)
│   │   │   └── store.ts    # Redux store configuration
│   │   └── App.tsx         # App entry point
└── README.md

⚡ Installation & Setup

1️⃣ Clone repository

git clone https://github.com/username/instagram-clone.git
cd instagram-clone

2️⃣ Setup backend

cd backend
npm install

Set .env:

DATABASE_URL=mysql://user:password@localhost:3306/instagram_db
JWT_PRIVATE_KEY=your_private_key
JWT_PUBLIC_KEY=your_public_key
CLOUDINARY_URL=your_cloudinary_url
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

3️⃣ Setup database (Docker)

Use docker-compose.yml:

version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: instagram_db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - '3306:3306'
    volumes:
      - db-data:/var/lib/mysql
volumes:
  db-data:

Run:

docker-compose up -d

4️⃣ Setup Prisma

cd backend
npx prisma migrate dev

5️⃣ Setup frontend

cd frontend
npm install

6️⃣ Run application

Backend:

cd backend
npm run start:dev

Frontend:

cd frontend
npm run start

App runs at:





Frontend: http://localhost:3000



Backend: http://localhost:4001

🧪 Tests

# Backend unit tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

🚀 Deployment

Deploy with Docker or follow Node.js deployment docs. Example Docker setup:

version: '3.8'
services:
  backend:
    image: node:18
    working_dir: /app
    volumes:
      - ./backend:/app
    command: npm run start:prod
    ports:
      - '4001:4001'
  frontend:
    image: node:18
    working_dir: /app
    volumes:
      - ./frontend:/app
    command: npm run build && npm run start
    ports:
      - '3000:3000'
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: instagram_db
    volumes:
      - db-data:/var/lib/mysql
volumes:
  db-data:

🤝 Contributing





Fork repo.



Create branch (git checkout -b feature/your-feature).



Commit (git commit -m 'Add feature').



Push (git push origin feature/your-feature).



Create Pull Request.

📚 Resources





Node.js Docs



React Docs



Prisma Docs



Cloudinary Docs



Docker Docs

📜 License

MIT
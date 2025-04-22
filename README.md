This guide will help you set up and run this project locally :)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-project.git
cd your-project

```

### 2. Install Dependencies
Run the following command in your terminal to install the necessary dependencies:
```
npm install
npm install mongodb

```
Make sure you have Node.js installed on your machine, if not, run these :
```
npm install
npm install next
```

### 3.Set Up MongoDB
Create an account at MongoDB Atlas.
Set up a cluster and create a database.
Generate your MongoDB connection string (URI).

### 4.Environment Variables
Create a file named ```.env.local``` in the root directory of your project.
Add the following content to it:
```
NEXTAUTH_SECRET=your_very_long_random_cryptographic_secret
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
```
Replace username, password, and database_name with your actual MongoDB credentials.
Ensure NEXTAUTH_SECRET is a securely generated random string.

### 5.Start the Server
```npm run dev```
Visit http://localhost:3000 in your browser to view the project.











# Cognifyz Full-Stack Internship | Level 3: Task 6

## 🛡️ Complete Database Persistence, Authentication, & Endpoint Authorization

Welcome to the production repository for **Level 3, Task 6**. This final capstone integration wires the web workspace to a persistent **MongoDB Database Engine** via the Mongoose ODM framework and wraps it completely inside a highly secure user authentication ecosystem. 

---

## 💎 Core Architectural Engineering Features

* **Persistent Document Cluster Partitioning:** Replaces primitive transient data tracking with robust MongoDB database memory maps structured using independent Mongoose Schemas.
* **Cryptographic Credentials Masking:** Runs background `.pre('save')` schema hooks that automatically intercept plain text signup credentials to generate random 10-character salt rounds and secure hashes via `bcryptjs`.
* **Stateful Session Gatekeepers:** Utilizes `express-session` cookies to assign ephemeral tracking tokens securely on the server-side, preventing unauthorized connection tracking.
* **Granular Ownership Authorization Wall:** Implements strict authorization middleware barriers that filter API endpoints, ensuring an authenticated context can only interact with datasets explicitly linked to their user identification token.

---

## 📂 Project Directory Architecture

```text
task6-auth-db/
├── models/
│   ├── User.js          # Cryptographically hashed user identity credentials schema
│   └── Resource.js      # Secured data schema tied to specific user owners
├── middleware/
│   └── auth.js          # Authorization wall checking active session validation tokens
├── views/
│   ├── register.ejs     # Access signup control screen
│   ├── login.ejs        # Access credential verification gate
│   └── dashboard.ejs    # Secured CRUD data ledger panel
├── server.js            # Master Express routing engine and MongoDB coordinator
└── package.json         # Project system dependencies tracker"# TASK6-Cognify" 

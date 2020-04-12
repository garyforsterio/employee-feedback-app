## Employee Feedback App

This mono-repository contains the system setup for the evaluation and management of employees.

### Architecture

Here is an overview of the architecture
![System architecture](./system-architecture.png 'System Architecture')

---

### Structure

This repository uses Lerna to manage projects. They are:

#### Backend

The backend for the system. See documentation [here](./packages/backend/README.md)

#### Client

The web app client. See documentation [here](./packages/client/README.md)

---

### Deployment

The system utilises docker-compose to allow for easy deployment across environments. To get started please follow these steps:

1. Install Docker Compose (setup [here](https://docs.docker.com/compose/install/))
2. Navigate to the root folder of this repository
3. Run `docker-compose up -d` (prefixing `sudo` may be required)
4. Wait for docker to pull the neccasary images, build the projects and start everything up
5. Navigate to [http://localhost/]([http://localhost/])
6. On the login page input the following dummy admin credential:

- Email: admin@example.com
- Password: admin

Tested using Docker Compose v1.24.1 and Docker v19.03.8. If you have any difficulties with setup please open an issue in this repository

---

### Assumptions

The following assumptions were made when creating this project

- The number of users is small

  > This assumption invalidates the necessity of a load-balancer in the system architecture in addition to adding scalablity through kubernetes, sharding etc.

- Users and employees have a 1:1 relationship

  > If this product was to be used as a multi-tenancy application, users and employees would need to be decoupled to allow for one user to be evaluated in several companies.

- Administrators are also employees, and as such can be reviewed.

  > Through the tool both administrators and normal users can be evaluated.

- Users can evaluate their own performace

  > A vital part of development is one's ability to self-evaluate.

- Employee feedback cannot be edited or deleted
  > To promote honesty and maintain integrety in the process.

---

### Frameworks

The following frameworks are used:

- React
- Gatsby
- i18next
- Typescript
- Node.js
- Koa.js
- MongoDB
- Docker
- Lerna
- Nginx

---

### Screenshots

#### Admin Console

- Responsive
- Utilizing routing

![User overview](./screenshots/admin-desktop-1.jpg 'User overview')

![Request feedback](./screenshots/admin-desktop-2.jpg 'Request feedback')

![Mobile version](./screenshots/admin-mobile.jpg 'Mobile version')

#### Feedback page

![Feedback page](./screenshots/feedback-desktop.jpg 'Feedback page')

![Mobile version](./screenshots/feedback-mobile.jpg 'Mobile version')

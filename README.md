## Employee Feedback App

This mono-repository contains the sytem setup for the evaluation and management of employees.

### Architecture

Here is an overview of the architecture
![System architecture](./system-architecture.png 'System Architecture')

### Structure

This repository uses Lerna to managing projects. They are

#### Backend

The backend for the system. See documentation [here](./packages/backend/README.md)

#### Client

The web app client. See documentation [here](./packages/client/README.md)

### Assumptions

The following assumptions were made when creating this project

- The number of users is small

  > This assumption invalidates the necessity of a load-balancer in the system architecture in addition to scalablity through kubernetes, sharding etc.

- Users and employees have a 1:1 relationship

  > If this product was to be used as a multi-tenancy application, users and employees would need to be decoupled to allow for one user to be evaluated in several companies.

- Administrators are also employees, and as such can be reviewed.

  > Through the tool both administrators and normal users can be evaluated.

- Users can evaluate their own performace

  > A vital part of development is one's ability to self-evaluate

- A performance review is completed by a sole evaluator.

  > Configuring a system to allow multiple users to edit a single performance review, whilst possible, was beyond the scope of this project.

- Employee feedback cannot be edited or deleted
  > To promote honesty and maintain integrety in the process.

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

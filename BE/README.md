# Amadeo-crm Application

> Est. late 2021

----------------------------------------------------------------

## Requirements

NodeJS 16+

### Developer Notes

Do not forget to switch to correct NodeJS version in case of using node version manager.

```bash
nvm use 16
```

----------------------------------------------------------------

## Amadeo-crm App Specifications

* **Codebase**:             Pure JavaScript (no JQuery, TypeScript etc)
* **Structure**:            Monolith (API, Front -- both are one single app)
* **Framework for Front**:  Pure JavaScript (No Framework)
* **Framework for API**:    Express [link](http://expressjs.com)
* **Bundler**:              Rollup [link](https://www.rollupjs.org)
* **Code Analyser**:        ESLint [link](https://eslint.org)
* **DB Migrations**:        Node-pg-migrate [link](https://salsita.github.io/node-pg-migrate)

----------------------------------------------------------------

## Running App

```bash
npm run dev
npm start
```

----------------------------------------------------------------
## 🛠️ To serve the user interface of your Express app, run the following command in a separate terminal window:

```bash
npm run ui
```

## 📦 For migration use node-pg-migrate:

```bash
npm run migrate create my first migration. 
```
It will create file xxx_my-first-migration.js in migrations folder.

For running migration use
```bash
DATABASE_URL=postgres://db_user:db_password@db_host:db_port/db_name npm run migrate up
```

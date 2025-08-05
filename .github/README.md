<div align="center">
  <h3>Windswept</h3>
</div>

<div align="center">
   <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/windswept-bot/windswept">
   <img alt="GitHub Issues" src="https://img.shields.io/github/issues/windswept-bot/windswept">
   <img alt="GitHub Branch Status" src="https://img.shields.io/github/check-runs/windswept-bot/windswept/deployment%2Fstaging">
</div>

## 👀 Overview

Windswept is a multipurpose Discord bot that makes managing your servers easier with features that boost community engagement.


## 🔧 Project Setup

### 1. Requirements

> Expand a requirement to view more info

<details>
  <summary>
    <a href="https://nodejs.org/">
      Node
    </a>
  </summary>
  Runtime environment.
</details>

<details>
  <summary>
    <a href="https://www.doppler.com/">
      Doppler
    </a>
  </summary>
  Centralised Environment Variables & Secrets Manager.
</details>

<details>
  <summary>
    <a href="https://www.docker.com/">
      Docker
    </a>
  </summary>
  Containers for local development, Docker is not used in production.
</details>

---

### 2. Doppler Authentication

> To keep our envionments safe, Windswept has 3 different configs between **Dev**, **Staging** and **Production**. Unless you're apart of the [Windswept Development Team](https://github.com/orgs/windswept-bot/people), you won't have access to these environments and will need to setup your own Doppler flow that works for you.

- Create an account on https://doppler.com/
- Create a Workspace (free for personal use)
- Configure your environment(s) to use these variables names (unless you'd like to change them):
  - ```
    DATABASE_URL
    DISCORD_CLIENT_ID
    DISCORD_TOKEN
    TEST_GUILD_ID
    ```
- Follow the Doppler CLI docs to install Doppler onto your machine.
- Login to your account.
  - ```
    doppler login
    ```
- Setup your Workspace by selecting from your environments.
  - > For me, this would be **Dev**.
    ```
    doppler setup
    ```

That's it! You've created a free doppler account which allows you to manage multiple secrets without an env file, sweet. 👀

---

### 3. Install packages

To install the required project packages using Node, please run:

```bash
npm install
```

> You can see which packages this project utilises by viewing [package.json](https://github.com/windswept-bot/windswept/blob/deployment/staging/package.json). We aim to keep this project fairly lightweight, with 0 vulnerabilities by only using maintained, trusted packages.

### 4. Run the project!

You're ready to go. This handy script handles setting up your local Docker Database for you, just **make sure that you're running Docker first**, otherwise the Database will fail!

```bash
npm run dev
```

You should see pretty terminal messages that indicate everything's working!

---

## 🤔 Having issues?

Please [open an issue](https://github.com/windswept-bot/windswept/issues) describing the problem you're facing so we can help!


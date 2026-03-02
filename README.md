# Hi there 👋, I'm Shavrka

<div align="center">

![GitHub Stats](./profile/stats.svg)

![GitHub Streak](./profile/streak.svg)

![Top Languages](./profile/langs.svg)

</div>

---

## 🛠 Instructions: How to include private repositories in your stats

If you work on private repositories and want those contributions (commits) to show up on your stats cards (like commit count, streak, top languages), you need to set up a **Personal Access Token (PAT)** and enable private contributions on your profile.

### Step 1: Enable private contributions on your GitHub profile
In order for your private commits to even count in your GitHub *Contribution* graph, you need to enable it in your profile settings:
1. Open your **GitHub profile** (`https://github.com/your_username`).
2. Scroll down to your green contribution graph.
3. In the top right corner above the graph, click on **"Contribution settings"** (dropdown menu).
4. Check the **"Private contributions"** option. (This will add your private repository commits to the graph without revealing the names of those repositories to others).

### Step 2: Create a Personal Access Token (PAT)
For this script to read data from your private repositories (to create accurate SVG stats), it needs token access.
1. Go to the top right corner of GitHub (your profile picture) and click **Settings**.
2. At the bottom of the left sidebar, click on **Developer settings**.
3. Then go to **Personal access tokens** -> **Tokens (classic)**.
4. Click the **Generate new token (classic)** button.
5. In the **Note** field, write whatever you want (e.g., `PAT_STATS`).
6. Under **Expiration**, it is recommended to set `No expiration` (or a specific longer period, but you will have to renew it when it expires).
7. In the **Select scopes** section, make sure to check:
   - **`repo`** (this allows access to both public and private repositories).
   - **`read:user`** and **`user:email`** (under the `user` section, to fetch user data).
8. Scroll to the bottom of the page and click **Generate token**.
9. **Copy the generated token immediately** because you won't be able to see it again after closing the page!

### Step 3: Add the token to the repository (Repository Secrets)
Now you must add that token to this repository so the GitHub Action script can use it.
1. Open this repository on GitHub.
2. Click on the **Settings** tab (repository settings).
3. On the left side menu, go to **Secrets and variables** -> **Actions**.
4. Click the green **New repository secret** button.
5. In the **Name** field, you must type exactly the following: `PAT_STATS` (this is how it's defined in the `.github/workflows/update-stats.yml` file).
6. In the **Secret** field, paste your copied token from the previous step.
7. Click **Add secret**.

### Step 4: Test it (Run the GitHub Action)
After adding the secret, you can manually run the action to generate the new stats.
1. In this repository, click on the **Actions** tab.
2. On the left side, select your workflow (e.g., **Update GitHub Stats Cards**).
3. On the right side, click the **Run workflow** dropdown menu.
4. Confirm by clicking the green **Run workflow** button.

Once the action finishes successfully (shows a green checkmark), your cards (`stats.svg`, `streak.svg`, `langs.svg`) will be automatically updated and will include your private stats!
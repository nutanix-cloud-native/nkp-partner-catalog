# nkp-partner-catalog

This repository is dedicated to storing applications manifests and other metadata required for partner applications. Contributions for new applications should be made here and will be reviewed and merged upon approval by the internal team.

---

## Finding your way around

- **`applications/`**  
  Contains all partner applications. Each application can have multiple versions organized in **semver-named subdirectories**. Each version directory includes the manifest files corresponding that single version.

- **`just/`**  
  Contains [just](https://just.systems/man/en/introduction.html) recipes used to perform various actions on the applications.

- **`apptests/`**  
  Contains test suites for each application's installation and upgrade scenarios.

---

## Signing commits

All commits to this repository **must be signed**.  
Learn how to sign your commits here:  
[Managing commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification)

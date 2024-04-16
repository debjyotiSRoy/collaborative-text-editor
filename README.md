
# Collaborative Editor

Welcome to Collaborative Editor! This project is aimed at creating a collaborative text editor using JavaScript and Automerge.

## Getting Started

To use this project, you'll need to have Node.js and npm (Node Package Manager) installed on your system. If you want to manage multiple versions of Node.js, you can also use Node Version Manager (nvm).

### Installing Node.js and npm

1. **Node.js Installer** (Recommended):
   - Visit the [official Node.js website](https://nodejs.org).
   - Download the installer for your operating system (Windows, macOS, or Linux).
   - Run the installer and follow the prompts to install Node.js and npm.
   - After installation, open a terminal or command prompt and run the following commands to verify that Node.js and npm are installed correctly:
     ```bash
     node -v
     npm -v
     ```

     - Example versions used for this project:
       ```
       node -v: v21.7.1
       npm -v: 10.5.2
       ```

2. **Using Package Managers**:
   - **On macOS or Linux**:
     - Homebrew:
       ```bash
       brew install node
       ```
     - apt:
       ```bash
       sudo apt install nodejs npm
       ```
   - **On Windows**:
     - Chocolatey:
       ```bash
       choco install nodejs
       ```

3. **Using Node Version Manager (nvm)**:
   - Node Version Manager (nvm) allows you to manage multiple versions of Node.js and npm on your system.
   - Visit the [nvm GitHub repository](https://github.com/nvm-sh/nvm) for installation instructions.

     - Example version used for this project:
       ```
       nvm -v: 0.39.1
       ```

Once you have Node.js and npm installed, you're ready to use the Collaborative Editor project!. Note that node and npm are already installed on Khoury Linux cluster but you will have to install nvm.

## Usage

### Cloning the Repository

To get started with the Collaborative Editor project, you can clone the GitHub repository using the following command:

```bash
git clone https://github.com/debjyotiSRoy/collaborative-text-editor.git
```

### Installing Dependencies

#### Root Directory (Server)

Navigate into the root directory of the project and install the necessary server dependencies using npm:

```bash
cd collaborative-text-editor
npm install
```

#### Client Directory

Navigate into the client subdirectory and install the necessary client dependencies using npm:

```bash
cd client
npm install
```
![image description here](https://github.com/debjyotiSRoy/collaborative-text-editor/blob/master/setup1.png)

## Contributing

TODO: Add contribution guidelines if applicable.

## License

TODO: Add license information.


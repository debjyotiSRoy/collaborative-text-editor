
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
### Running the Application
![Khoury Linux Setup](https://github.com/debjyotiSRoy/collaborative-text-editor/blob/master/setup1.png)
Follow the above image: We will create one server, and two clients. (You can create as many clients using the template below. I have shown the example with two clients)

 1. SERVER: Login to server with port forwarding
```bash
ssh -L 5000:localhost:5000  debjyoti@linux-085.khoury.northeastern.edu
[deb@linux-085.khoury.northeastern.edu]> cd collaborative-text-editor
[deb@linux-085.khoury.northeastern.edu]> node server.js
```
2. CLIENT 1a: Login to to client with port forwarding. Then from client login to server with port forwarding
```bash
ssh -L 8081:localhost:8081 debjyoti@linux-071.khoury.northeastern.edu
[deb@linux-071.khoury.northeastern.edu]> ssh -L 5000:localhost:5000 linux-085
[deb@linux-085.khoury.northeastern.edu]>
```
3. CLIENT 1b: Login to the same client as 1a, navigate to the client sub-directory. Then check if you can curl the server. Finally, run the client application at port 8081
```bash
ssh debjyoti@linux-071.khoury.northeastern.edu
[deb@linux-071.khoury.northeastern.edu]> cd collaborative-text-editor/client
[deb@linux-071.khoury.northeastern.edu]> curl -X OPTIONS -i http://localhost:5000/api/items

HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
Access-Control-Allow-Headers: Content-Type,X-Auth-Token,Origin,Authorization
Content-Length: 0
Date: Tue, 16 Apr 2024 21:52:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[deb@linux-071.khoury.northeastern.edu]> npm run serve -- --port 8081
 
 WARNING  Compiled with 1 warning                                       6:26:24 PM

 warning  in ./node_modules/@automerge/automerge-wasm/bundler/automerge_wasm_bg.wasm

The generated code contains 'async/await' because this module is using "asyncWebAssembly".
However, your target environment does not appear to support 'async/await'.
As a result, the code may not run as expected or may cause runtime errors.


  App running at:
  - Local:   http://localhost:8081/
  - Network: http://10.200.125.71:8081/

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```
4. CLIENT 2a: Login to another client with (a different) port forwarding. Then from client login to server with port forwarding
```bash
ssh -L 8082:localhost:8082 debjyoti@linux-072.khoury.northeastern.edu
[deb@linux-072.khoury.northeastern.edu]> ssh -L 5000:localhost:5000 linux-085
[deb@linux-085.khoury.northeastern.edu]>
```

5. CLIENT 2b: Login to the same client as 2a, navigate to the client sub-directory. Then check if you can curl the server. Finally, run the client application at port 8082
```bash
ssh debjyoti@linux-072.khoury.northeastern.edu
[deb@linux-072.khoury.northeastern.edu]> cd collaborative-text-editor/client
[deb@linux-072.khoury.northeastern.edu]> curl -X OPTIONS -i http://localhost:5000/api/items

HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
Access-Control-Allow-Headers: Content-Type,X-Auth-Token,Origin,Authorization
Content-Length: 0
Date: Tue, 16 Apr 2024 21:50:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[deb@linux-072.khoury.northeastern.edu]> npm run serve -- --port 8082

 WARNING  Compiled with 1 warning                                       6:37:48 PM

 warning  in ./node_modules/@automerge/automerge-wasm/bundler/automerge_wasm_bg.wasm

The generated code contains 'async/await' because this module is using "asyncWebAssembly".
However, your target environment does not appear to support 'async/await'.
As a result, the code may not run as expected or may cause runtime errors.


  App running at:
  - Local:   http://localhost:8082/
  - Network: http://10.200.125.72:8082/

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```
6. Now head over to your browser and and open and open two windows side by side with urls: http://localhost:8081/ and http://localhost:8082/. These are your two clients. Picture attached below for reference. 
![Clients-sidebyside](https://github.com/debjyotiSRoy/collaborative-text-editor/blob/master/clientssidebyside.png)

## Contributing

TODO: Add contribution guidelines if applicable.

## License

TODO: Add license information.


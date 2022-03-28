// 10.01 create main.ts, 
// 10.03 /server/npm install dotenv
// 10.04 require dotenv
const dotenv = require('dotenv');

// 10.05 get access dot .env
const result = dotenv.config();

if(result.error) {
  //  10.06 'throw stops the execution of the rest of the code. No need to iitialize the server.
  throw result.error;
}



console.log('.env loaded')

// 14.01 add debugger (check package.json for sequence of commands);
// 14.02 /server> npm run debug
// 14.03 chrome => chrome://inspect
// 14.04 chrome => click "inspect" => new window DevTools
// debugger;

// console.log("Loaded environment config: " , result.parsed);
console.log('Hi from: main.ts'); 

// 10.08 import initServer (this way we know our environment is loaded before we start up the server)
import { initServer } from "./server";

// 10.09 call initServer
initServer();

// 10.10 server/npm run build (uses server.tsconfig.json through package.json => "build") and adds files to server/dist/
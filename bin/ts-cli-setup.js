require('ts-node').register(
    Object.assign(
      {
        "dir": __dirname,
        ignore: [/\.js/],
      },
      require('../tsconfig.json'),
      {
        "compilerOptions": {
          "target": "esnext",
          "module": "commonjs",
          "strict": true,
          "moduleResolution": "node",
          "skipLibCheck": true,
          "esModuleInterop": true,
          "types": [
            "webpack-env",
            "jest",
            "node"
          ],
        }
    }
    ),
  );
import { exec } from "child_process";

const version = process.argv[2];

if (!version) {
  console.error("Please provide a version number.");
  process.exit(1);
}

console.log("Releasing new version...");

await exec(
  `git push && git update-ref refs/heads/v1 refs/heads/main && git push origin v${version} --force`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing git commands: ${error.message}`);
      process.exit(1);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      process.exit(1);
    }
    console.log(`stdout: ${stdout}`);
  }
);

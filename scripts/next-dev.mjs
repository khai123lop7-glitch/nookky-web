import { spawn } from "node:child_process";

const forwarded = process.argv.slice(2);
const nextArgs = ["dev"];

for (let index = 0; index < forwarded.length; index += 1) {
  const argument = forwarded[index];

  if (argument === "--host") {
    nextArgs.push("--hostname", forwarded[index + 1]);
    index += 1;
    continue;
  }

  if (argument === "--strictPort") continue;
  nextArgs.push(argument);
}

const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", ...nextArgs], {
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

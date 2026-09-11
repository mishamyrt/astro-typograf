import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import manifest from "../package.json" with { type: "json" }

const cwd = fileURLToPath(new URL("..", import.meta.url))
const git = (...args) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  })

if (git("status", "--porcelain").trim()) {
  throw new Error("Commit or stash all changes before creating a release tag.")
}

const tag = `v${manifest.version}`
git("tag", "-a", tag, "-m", tag)
git("push", "--no-follow-tags", "origin", `refs/tags/${tag}`)
console.log(`Pushed ${tag}. GitHub Actions will publish the release.`)

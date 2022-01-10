import fs from "fs";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();

// === CONFIG ===
const authorName = "Kumar Manak"; // Your GitHub name
const authorEmail = "manakkash20@gmail.com"; // Your GitHub-linked email
const branch = "main"; // Default branch of your fork

// Load or create commit-data.json
const jsonFile = "./commit-data.json";
let commitData = { commits: [] };
if (fs.existsSync(jsonFile)) {
  commitData = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
}

// Function to create backdated commits for a date
async function createCommitsForDate(date, count) {
  for (let i = 0; i < count; i++) {
    // Random time for the day
    const timestamp = moment(date)
      .hour(random.int(0, 23))
      .minute(random.int(0, 59))
      .second(random.int(0, 59))
      .toISOString();

    // Update JSON
    commitData.commits.push({ timestamp });
    fs.writeFileSync(jsonFile, JSON.stringify(commitData, null, 2));

    // Temporary file to trigger change
    fs.writeFileSync("temp-file.txt", `Commit at: ${timestamp}`);

    // Commit with backdated timestamp and correct author
    await git.add(".");
    await git.commit(`Commit on ${timestamp}`, {
      "--date": timestamp,
      "--author": `"${authorName} <${authorEmail}>"`,
    });

    console.log(`Created commit: ${timestamp}`);
  }

  // Push all commits automatically
  await git.push("origin", branch);
  console.log("All commits pushed to GitHub!");
}

// === EXAMPLE USAGE ===
// Create 5 commits on Jan 10, 2022
createCommitsForDate("2022-01-10", 5);

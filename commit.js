import fs from "fs";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();

// Load existing commit data
let commitData = JSON.parse(fs.readFileSync("./commit-data.json", "utf8"));

// Function to create commits for a specific date
async function createCommitsForDate(date, count) {
  for (let i = 0; i < count; i++) {
    const timestamp = moment(date)
      .hour(random.int(0, 23))
      .minute(random.int(0, 59))
      .second(random.int(0, 59))
      .toISOString();

    // Add timestamp to JSON
    commitData.commits.push({ timestamp });

    // Write JSON after each commit
    fs.writeFileSync(
      "./commit-data.json",
      JSON.stringify(commitData, null, 2)
    );

    // Write to a temp file to trigger git change
    fs.writeFileSync("temp-file.txt", `Commit at: ${timestamp}`);

    // Create backdated commit
    await git.add(".");
    await git.commit(`Commit on ${timestamp}`, {
      "--date": timestamp,
    });

    console.log(`Created commit: ${timestamp}`);
  }
}

// Example: Create 5 commits on Jan 10, 2022
createCommitsForDate("2025-01-10", 5);

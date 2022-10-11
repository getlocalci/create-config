import CircleCI from "@circleci/circleci-config-sdk";
import fs from "fs";
import glob from "glob";
import path from "path";

/**
 * Job names you can pass to createConfig().
 * These already have jobs created for them.
 */
export const JobNames = {
  E2eTest: "e2e-test",
  JsLint: "js-lint",
  JsTest: "js-test",
  PhpLint: "php-lint",
  PhpTest: "php-test",
  Vsix: "vsix",
  Zip: "zip",
};

const nodeExecutor = new CircleCI.executors.DockerExecutor(
  "cimg/node:lts",
  "large"
);

const preCreatedJobs = [
  new CircleCI.Job(JobNames.JsLint, nodeExecutor, [
    new CircleCI.commands.Checkout(),
    new CircleCI.commands.Run({
      command: "npm ci && npm run lint",
    }),
  ]),
  new CircleCI.Job(JobNames.JsTest, nodeExecutor, [
    new CircleCI.commands.Checkout(),
    new CircleCI.commands.Run({ command: "npm ci && npm test" }),
  ]),
  new CircleCI.Job(
    JobNames.PhpLint,
    new CircleCI.executors.DockerExecutor("cimg/php:8.0", "large"),
    [
      new CircleCI.commands.Checkout(),
      new CircleCI.commands.Run({
        command: "composer i && composer lint",
      }),
    ]
  ),
  new CircleCI.Job(
    JobNames.PhpTest,
    new CircleCI.executors.DockerExecutor("cimg/php:8.1", "large"),
    [
      new CircleCI.commands.Checkout(),
      new CircleCI.commands.Run({ command: "composer i && composer test" }),
    ]
  ),
  new CircleCI.Job(
    JobNames.E2eTest,
    new CircleCI.executors.MachineExecutor("large", "ubuntu-2004:202111-02"),
    [
      new CircleCI.commands.Checkout(),
      new CircleCI.commands.Run({ command: "npm ci" }),
      new CircleCI.commands.Run({
        name: "Running e2e tests",
        command: "npm run wp-env start && npm run test:e2e",
      }),
      new CircleCI.commands.StoreArtifacts({ path: "artifacts" }),
    ]
  ),
  new CircleCI.Job(
    JobNames.Vsix,
    new CircleCI.executors.DockerExecutor("cimg/node:16.8.0-browsers", "large"),
    [
      new CircleCI.commands.Checkout(),
      new CircleCI.commands.Run({ command: "npm ci && npm run vsix" }),
      new CircleCI.commands.Run({
        command: `mkdir /tmp/artifacts
          mv ${
            JSON.parse(
              fs.existsSync("../../package.json")
                ? fs.readFileSync("../../package.json")?.toString()
                : "{}"
            ).name
          }*.vsix /tmp/artifacts`,
      }),
      new CircleCI.commands.StoreArtifacts({ path: "/tmp/artifacts" }),
    ]
  ),
  new CircleCI.Job(
    JobNames.Zip,
    new CircleCI.executors.DockerExecutor("cimg/php:8.0"),
    [
      new CircleCI.commands.Checkout(),
      new CircleCI.commands.Run({ command: "composer zip" }),
      new CircleCI.commands.StoreArtifacts({
        path: `${path.basename(
          glob.sync("../../*.php")?.[0] ?? "",
          ".php"
        )}.zip`,
      }),
    ]
  ),
];

/** Creates PHP test jobs, given the passed PHP versions. */
export function createPhpTestJobs(...phpVersions: string[]): CircleCI.Job[] {
  return phpVersions.map((phpVersion) => {
    return new CircleCI.Job(
      `php-test-${phpVersion.replace(".", "-")}`,
      new CircleCI.executors.DockerExecutor(`cimg/php:${phpVersion}`),
      [
        new CircleCI.commands.Checkout(),
        new CircleCI.commands.Run({ command: "composer i && composer test" }),
      ]
    );
  });
}

/** Not needed for the public API, simply use createConfig(). */
export function getJobs(...jobs: (string | CircleCI.Job)[]): CircleCI.Job[] {
  return jobs.map((job) => {
    return typeof job === "string"
      ? preCreatedJobs.find((preCreatedJob) => {
          return job === preCreatedJob.name;
        })
      : job;
  });
}

/** Creates and writes the config, given the passed jobs. */
export function createConfig(...jobs: (string | CircleCI.Job)[]) {
  const config = new CircleCI.Config();
  const workflow = new CircleCI.Workflow("test-lint");
  config.addWorkflow(workflow);

  getJobs(...jobs).forEach((job) => {
    if (job) {
      config.addJob(job);
      workflow.addJob(job);
    }
  });

  fs.writeFile("./dynamicConfig.yml", config.stringify(), () => {});
}

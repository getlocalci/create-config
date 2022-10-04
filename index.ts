import * as fs from "fs";
import CircleCI from "@circleci/circleci-config-sdk";

const config = new CircleCI.Config();
const workflow = new CircleCI.Workflow("test-lint");
config.addWorkflow(workflow);

export const JobNames = {
  PhpLint: "php-lint",
  PhpTest: "php-test",
  JsLint: "js-lint",
  JsTest: "js-test",
  Zip: "zip",
}

const preCreatedJobs = [
  new CircleCI.Job(
    JobNames.JsLint,
    new CircleCI.executors.DockerExecutor("cimg/node:lts", "large"),
    [
      new CircleCI.commands.Checkout(),
      new CircleCI.commands.Run({
        command: "npm ci && npm run lint",
      }),
    ]
  ),
  new CircleCI.Job(
    JobNames.JsTest,
    new CircleCI.executors.DockerExecutor("cimg/node:lts", "large"),
    [
      new CircleCI.commands.Checkout(),
      new CircleCI.commands.Run({ command: "npm ci && npm test" }),
    ]
  ),
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
    JobNames.Zip,
    new CircleCI.executors.DockerExecutor("cimg/php:8.0"),
    [
      new CircleCI.commands.Checkout(),
      new CircleCI.commands.Run({ command: "composer zip" }),
      new CircleCI.commands.StoreArtifacts({
        path: "adapter-gravity-add-on.zip",
      }),
    ]
  ),
];

export default function createConfig(...jobs: (string | CircleCI.Job)[]) {
  jobs.forEach((job) => {
    if (job instanceof CircleCI.Job) {
      config.addJob(job);
      workflow.addJob(job);
      return;
    }

    if (!preCreatedJobs[job]) {
      throw new Error(
        `Job ${job} does not exist. Please use the JobNames type, like JobNames.JsTest.`
      );
    }

    config.addJob(preCreatedJobs[job]);
    workflow.addJob(preCreatedJobs[job]);
  });

  fs.writeFile("./dynamicConfig.yml", config.stringify(), () => {});
}

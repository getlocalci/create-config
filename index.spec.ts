import CircleCI from "@circleci/circleci-config-sdk";
import { getJobs, JobNames } from "./index.js";

function assertEquals(expected: any, actual: any) {
  if (expected !== actual) {
    throw new Error(`Expected ${expected}, but got ${actual}`)
  }
}

const simpleJobs = getJobs(JobNames.JsLint, JobNames.JsTest);

assertEquals(2, simpleJobs.length);
assertEquals(true, simpleJobs[0] instanceof CircleCI.Job);
assertEquals(true, simpleJobs[1] instanceof CircleCI.Job);

assertEquals(JobNames.JsLint, simpleJobs[0].name);
assertEquals(JobNames.JsTest, simpleJobs[1].name);

const complexJobs = getJobs(
  JobNames.JsLint,
  new CircleCI.Job(
    "python-test",
    new CircleCI.executors.DockerExecutor("cimg/python:3.10.7", "large"),
    [
      new CircleCI.commands.Checkout(),
      new CircleCI.commands.Run({ command: "pip install && python -m pytest" }),
    ]
  )
);

assertEquals(2, complexJobs.length);
assertEquals("python-test", complexJobs[1].name);

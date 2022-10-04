import CircleCI from "@circleci/circleci-config-sdk";
import { getJobs, JobNames } from ".";

describe("getJobs", () => {
  it("can get jobs using JobNames", () => {
    const jobs = getJobs(JobNames.JsLint, JobNames.JsTest);

    expect(jobs.length).toBe(2);
    expect(jobs[0] instanceof CircleCI.Job).toBe(true);
    expect(jobs[1] instanceof CircleCI.Job).toBe(true);

    expect((jobs[0]).name).toBe(JobNames.JsLint);
    expect((jobs[1]).name).toBe(JobNames.JsTest);
  });

  it("can get a custom job", () => {
    const jobs = getJobs(
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

    expect(jobs.length).toBe(2);
    expect((jobs[1]).name).toBe("python-test");
  });
});

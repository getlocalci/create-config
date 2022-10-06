<div align="center">
<h1>Create Config</h1>
<p>Creates a CircleCI® config with as little as 3 lines of code.</p>
</div>

This is an example for you to write your own Create Config repo, not for you to use this.

You might have different preferences, like a medium image size.

You might have entirely different languages or jobs to run.

## Basic Usage

```typescript
import { createConfig, JobNames } from "@getlocalci/create-config";

createConfig(JobNames.PhpLint, JobNames.PhpTest, JobNames.Zip);
```

## Adding A Custom Job

```typescript
import CircleCI from "@circleci/circleci-config-sdk";
import { createConfig, JobNames } from "@getlocalci/create-config";

createConfig(
  JobNames.JsLint,
  JobNames.JsTest,
  new CircleCI.Job(
    "python-test",
    new CircleCI.executors.DockerExecutor("cimg/python:3.10.7", "large"),
    [
      new CircleCI.commands.Checkout(),
      new CircleCI.commands.Run({ command: "pip install && python -m pytest" }),
    ]
  )
);
```

<div align="center">
<h1>Create Config</h1>
<p>Creates a CircleCI® config with as little as 3 lines of code.</p>
</div>

## Reusable
You can use this config in any of your projects.

So you don't have to copy-paste CircleCI® config `.yml.`

## Writing Your Own
This is an example for you to write your own Create Config repo.

Feel free to fork this.

You might like different settings, like different image sizes.

Or maybe you use languages.

This has JavaScript and PHP.

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

Here, you [add a](https://getlocalci.com/circleci-config-sdk-tutorial/#last-2-jobs) `CircleCI.Job` with your own values.

For example, maybe you have a typical config you use for most of your repos.

But maybe a certain repo needs a specific job that no other repos need.

You can pass the `CircleCI.Job` as an argument to `createConfig()`.

## Live Example
See this in action at [.circleci/dynamic/](.circleci/dynamic/).

This repo uses its own `createConfig()` to test itself.

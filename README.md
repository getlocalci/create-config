<div align="center">
<h1>Create Config</h1>
<p>Create a CircleCI® config with as little as 3 lines of code.</p>
</div>

## Reusable
You can use this config in any of your projects.

So you don't have to copy-paste `.yml` in your CircleCI® configs.

## Writing Your Own
Feel free to fork this into your own Create Config repo.

You might want different settings, like different image sizes.

Or maybe you use different languages.

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

## Thank You
Thanks to [Kyle Tryon](https://github.com/KyleTryon) and [Jaryt Bustard](https://github.com/Jaryt) for their great work on the [CircleCI Config SDK](https://github.com/CircleCI-Public/circleci-config-sdk-ts).

This repo uses [Kyle's idea](https://circleci.com/blog/config-sdk/) of a common function in different repos.

## Live Example
See this in action at [.circleci/dynamic/](.circleci/dynamic/).

This repo uses its own `createConfig()` to test itself.

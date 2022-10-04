# Create Config

## Usage

```typescript
import { createConfig } from "@getlocalci/create-config";
import type { JobNames } from "@getlocalci/create-config";

createConfig(JobNames.PhpLint, JobNames.PhpTest, JobNames.Zip);
```

### Adding A Custom Job

```typescript
import CircleCI from "@circleci/circleci-config-sdk";
import { createConfig } from "@getlocalci/create-config";
import type { JobNames } from "@getlocalci/create-config";

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

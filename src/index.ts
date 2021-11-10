import {
  debug,
  exportVariable,
  setFailed,
} from "@actions/core";

function parseEnvVars(envVars: NodeJS.ProcessEnv): Array<[string, unknown]> {
  return Object.entries(envVars)
    .filter(
      ([name]) => name.startsWith("INPUT_")
    )
    .map(([name, value]) => {
      const transformedName = name.replace("INPUT_", "");
      return [transformedName, value?.trim()];
    });
}

try {
  const vars = parseEnvVars(process.env).forEach(
    ([name, value]) => {
      if (!value) {
          exportVariable(name, "");
          debug(`Exporting ${name} with an empty value`);
      } else {
        exportVariable(name, value);
        debug(`Exporting ${name} with value ${value}`);
      }
    }
  );
} catch (e) {
  setFailed(`Failed to parse environment variables: ${e}}`);
}

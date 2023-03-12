module.exports ={
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended","../.eslintrc.cjs"],
  env: {
    browser: true,
    node: true
  }
}

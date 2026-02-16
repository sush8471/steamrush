---
description: How to use CodeRabbit for automated code reviews
---

# CodeRabbit Setup and Usage Guide

## What is CodeRabbit?
CodeRabbit is an AI-powered code review assistant that automatically reviews your pull requests, providing intelligent feedback on code quality, potential bugs, security issues, and best practices.

## Setup Steps

### 1. Install CodeRabbit on GitHub
1. Go to https://coderabbit.ai
2. Click "Sign in with GitHub"
3. Authorize CodeRabbit to access your repositories
4. Select the `sush8471/steamrush` repository
5. Complete the installation

### 2. Configuration
The `.coderabbit.yaml` file in the root directory contains the configuration:
- **Profile**: Set to "chill" for balanced reviews
- **Auto-review**: Enabled for all non-draft PRs
- **Tools**: ESLint, Prettier, Biome, and other linters enabled
- **Path filters**: Excludes lock files, node_modules, and build artifacts
- **Path instructions**: Custom review guidelines for different code areas

### 3. Using CodeRabbit

#### Automatic Reviews
- CodeRabbit automatically reviews every pull request
- Reviews appear as comments on your PR
- Includes a high-level summary and detailed line-by-line feedback

#### Interactive Commands
You can interact with CodeRabbit using comments on your PR:

- `@coderabbitai review` - Request a fresh review
- `@coderabbitai summary` - Get a summary of changes
- `@coderabbitai resolve` - Mark a conversation as resolved
- `@coderabbitai help` - Get help with available commands
- `@coderabbitai pause` - Pause reviews for this PR
- `@coderabbitai resume` - Resume reviews for this PR

#### Review Focus Areas
Based on our configuration, CodeRabbit will focus on:

**For React Components (`src/app/**/*.tsx`, `src/components/**/*.tsx`):**
- Next.js 15 best practices
- TypeScript type safety
- Error handling
- Accessibility standards
- Component reusability
- React hooks usage
- Performance optimization

**For Utility Functions (`src/lib/**/*.ts`):**
- Error handling
- Type safety
- Documentation quality
- Function purity

### 4. Best Practices

1. **Address CodeRabbit feedback**: Review and address suggestions before merging
2. **Use interactive commands**: Ask CodeRabbit for clarification when needed
3. **Customize reviews**: Update `.coderabbit.yaml` as your needs evolve
4. **Learn from reviews**: CodeRabbit's feedback helps improve coding skills

### 5. Workflow Integration

// turbo-all
1. Create a new branch for your feature
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit
```bash
git add .
git commit -m "feat: your feature description"
```

3. Push to GitHub
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub
   - CodeRabbit will automatically start reviewing
   - Wait for the review to complete (usually 1-2 minutes)

5. Address CodeRabbit's feedback
   - Make necessary changes
   - Push updates to the same branch
   - CodeRabbit will re-review automatically

6. Merge when ready
   - Ensure all CodeRabbit suggestions are addressed
   - Merge the PR

## Troubleshooting

### CodeRabbit not reviewing
- Check that CodeRabbit is installed on your repository
- Ensure the PR is not marked as draft (unless you want draft reviews)
- Verify `.coderabbit.yaml` is valid YAML

### Too many/few comments
- Adjust the `profile` setting in `.coderabbit.yaml`:
  - `assertive`: More thorough reviews
  - `chill`: Balanced reviews (current setting)
  - `relaxed`: Fewer comments

### Excluding specific paths
Add patterns to `path_filters` in `.coderabbit.yaml`:
```yaml
path_filters:
  - "!**/test/**"  # Exclude test files
  - "!**/*.spec.ts"  # Exclude spec files
```

## Additional Resources
- [CodeRabbit Documentation](https://docs.coderabbit.ai)
- [Configuration Reference](https://docs.coderabbit.ai/guides/configure-coderabbit)
- [Best Practices](https://docs.coderabbit.ai/guides/best-practices)

# Scaleway Functions Deploy Action

A GitHub Action to deploy serverless functions to Scaleway Functions. This action automatically manages namespaces, creates functions, and handles deployments with minimal configuration.

## Features

- 🚀 **Automatic namespace management** - Creates namespaces if they don't exist
- 🔄 **Smart function handling** - Creates or updates functions based on branch names
- 📦 **Simple deployment** - Handles zip upload and deployment in one step
- 🏷️ **Branch-based naming** - Automatically names functions based on Git branch names
- 🔒 **Secure** - Uses Scaleway API tokens for authentication

## Prerequisites

- A Scaleway account with Functions enabled
- Scaleway Secret Key (API token)
- Scaleway Project ID
- Function source code in your repository

## Usage

### Basic Usage

```yaml
name: Deploy to Scaleway Functions
on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Create function.zip
        run: |
          # Create your function zip file here
          # Example for Node.js:
          zip -r function.zip . -x "*.git*" "node_modules/*" "*.md"
      
      - name: Deploy to Scaleway Functions
        uses: voorhoede/poc-scaleway-functions-deploys@v1
        with:
          scw_secret_key: ${{ secrets.SCW_SECRET_KEY }}
          scw_project_id: ${{ secrets.SCW_PROJECT_ID }}
```

### Advanced Usage with Node.js

```yaml
name: Deploy Node.js Function
on:
  push:
    branches: [main, staging, feature/*]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --only=production
      
      - name: Create deployment package
        run: |
          zip -r function.zip . \
            -x "*.git*" \
            -x "node_modules/.cache/*" \
            -x "*.md" \
            -x ".github/*" \
            -x "tests/*" \
            -x "*.test.js"
      
      - name: Deploy to Scaleway Functions
        uses: voorhoede/poc-scaleway-functions-deploys@v1
        with:
          scw_secret_key: ${{ secrets.SCW_SECRET_KEY }}
          scw_project_id: ${{ secrets.SCW_PROJECT_ID }}
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `scw_secret_key` | Your Scaleway Secret Key (API token) | ✅ Yes | - |
| `scw_project_id` | Your Scaleway Project ID | ✅ Yes | - |

## How It Works

1. **Namespace Management**: The action looks for a namespace with the same name as your repository. If it doesn't exist, it creates one automatically.

2. **Function Naming**: Functions are named based on your Git branch name, with automatic sanitization to meet Scaleway's naming requirements (lowercase alphanumeric characters and dashes only).

3. **Function Lifecycle**: 
   - Checks if a function with the branch name exists
   - Creates a new function if it doesn't exist
   - Uploads your `function.zip` file
   - Deploys the function

4. **Branch-based Deployments**: Each branch gets its own function, allowing for easy testing of different versions.

## Function.zip Requirements

The action expects a `function.zip` file in your repository root. This file should contain:

- Your function source code
- Dependencies (for Node.js: `node_modules` with production dependencies)
- Any configuration files your function needs

### Example function.zip contents for Node.js:
```
function.zip
├── index.js          # Your function handler
├── package.json      # Package configuration
├── node_modules/     # Production dependencies
└── lib/             # Additional source files
```

## Scaleway Configuration

### Creating a Secret Key

1. Go to the [Scaleway Console](https://console.scaleway.com/)
2. Navigate to "Credentials" in your account settings
3. Create a new API key with appropriate permissions
4. Copy the Secret Key and add it to your repository secrets as `SCW_SECRET_KEY`

### Finding Your Project ID

1. In the Scaleway Console, go to your project settings
2. Copy the Project ID and add it to your repository secrets as `SCW_PROJECT_ID`

## GitHub Secrets Setup

Add these secrets to your repository (Settings → Secrets and variables → Actions):

| Secret Name | Description |
|-------------|-------------|
| `SCW_SECRET_KEY` | Your Scaleway Secret Key (API token) |
| `SCW_PROJECT_ID` | Your Scaleway Project ID |

## Function Naming

Function names are automatically generated from your Git branch names with the following transformations:

- `main` → `main`
- `feature/user-auth` → `feature-user-auth`
- `bugfix/fix-login` → `bugfix-fix-login`
- `release/v1.2.3` → `release-v1-2-3`

Special characters, spaces, and uppercase letters are automatically converted to comply with Scaleway's naming requirements.

## Limitations

- Currently supports the `nl-ams` (Amsterdam) region only
- Uses Node.js 22 runtime by default
- Requires a pre-built `function.zip` file
- Maximum zip file size: 100 MiB (Scaleway limit)

## Troubleshooting

### "function.zip not found"
Make sure you create a `function.zip` file before calling this action:

```yaml
- name: Create function package
  run: zip -r function.zip . -x "*.git*"

- name: Deploy to Scaleway Functions  
  uses: voorhoede/poc-scaleway-functions-deploys@v1
  # ...
```

### "Invalid Secret Key"
- Verify your `SCW_SECRET_KEY` is correct
- Make sure the API key has the necessary permissions for Serverless Functions
- Check that the secret is properly set in your repository

### "Project not found"
- Verify your `SCW_PROJECT_ID` is correct
- Ensure the project exists and you have access to it

## Examples

### Deploy on Multiple Branches
```yaml
on:
  push:
    branches: 
      - main
      - develop
      - 'feature/*'
      - 'hotfix/*'
```

### Deploy with Different Zip Strategies
```yaml
# For Python functions
- name: Create Python package
  run: |
    pip install -r requirements.txt -t .
    zip -r function.zip . -x "*.git*" "*.pyc" "__pycache__/*"

# For Go functions  
- name: Build and package Go function
  run: |
    GOOS=linux GOARCH=amd64 go build -o main
    zip function.zip main

# For PHP functions
- name: Package PHP function
  run: |
    composer install --no-dev --optimize-autoloader
    zip -r function.zip . -x "*.git*" "composer.json" "composer.lock"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/voorhoede/poc-scaleway-functions-deploys/issues) for existing solutions
2. Create a new issue with detailed information about your problem
3. Include your workflow configuration and error messages

---

**Made with ❤️ by [Voorhoede](https://github.com/voorhoede)**
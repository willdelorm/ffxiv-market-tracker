# FFXIV Market Tracker

A tool to track item prices on the Final Fantasy XIV market board. This project helps users monitor market trends, find good deals, and analyze the in-game economy.

## Features

*   Track prices for specific items across different worlds or data centers.
*   View historical price data.
*   (Add more features as they are developed)

## Prerequisites

*   [Node.js](https://nodejs.org/) (v18.x or later is recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ffxiv-market-tracker.git
    cd ffxiv-market-tracker
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

## Configuration

This project uses environment variables for configuration. These are managed in `.env` files and are ignored by Git for security.

1.  Create a local environment file by copying the example (you may need to create `.env.example` first if it doesn't exist):
    ```bash
    cp .env.example .env.local
    ```

2.  Update the `.env.local` file with your specific settings. You will likely need to configure things like:
    *   The world or data center to track.
    *   Any necessary API keys (e.g., for an external FFXIV market data API like Universalis).
    *   Database connection details.

    **Example `.env.local`:**
    ```env
    # The FFXIV World or Data Center to query
    FFXIV_LOCATION=Aether

    # Logging level (e.g., info, debug, warn, error)
    LOG_LEVEL=info
    ```

## Usage

### Development Server

To run the application in development mode:

```bash
npm run dev
```

### Production Build

1.  **Build the application for production:**
    ```bash
    npm run build
    ```
    This will create a `dist/` directory with the compiled output.

2.  **Run the production server:**
    ```bash
    npm start
    ```

## Running Tests

To run the test suite and generate a coverage report (output will be in the `coverage/` directory):
```bash
npm test
```
---
description: Read this file to understand how to fetch data in the project.
---

# Data Fetching Guidelines
This document outlines the best practices for fetching data in this project. Follow these guidelines to ensure consistency and maintainability across the codebase.

## 1. Use Server Components for Data Fetching

In Next.js, ALWAYS use Server Components to fetch data. Server Components allow you to fetch data on the server side, which can improve performance and reduce the amount of JavaScript sent to the client.

## 2. Data Fetching Methods
ALWAYS use the helper functions in the /data directory to fetch data. These functions are designed to handle common data fetching patterns and ensure that all data is fetched in a consistent manner.

ALL helper functions in the /data directory should return a Promise that resolves to the fetched data. This allows for better error handling and makes it easier to work with asynchronous data.
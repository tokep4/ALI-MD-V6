# Overview

This is a WhatsApp bot pairing service called "BWM XMD Scanner" by Ibrahim Adams. The application provides two methods for connecting WhatsApp bots: QR code scanning and phone number pairing. It includes a web interface for generating session credentials that can be used with WhatsApp bot frameworks, specifically using the Baileys library for WhatsApp Web integration.

The service has been successfully configured to run in the Replit environment with proper port binding, security fixes, and deployment configuration.

## Recent Changes

**September 15, 2025** - Initial Replit setup and security hardening:
- Configured server to use port 5000 and bind to 0.0.0.0 for Replit compatibility
- Removed hardcoded Pastebin API key for security
- Added input validation for phone number parameter in pairing endpoint
- Implemented robust temp directory creation at startup
- Configured autoscale deployment for production
- All tests passing, application fully functional

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses server-rendered HTML pages with embedded CSS and JavaScript for the user interface. Three main interfaces are provided:
- **Landing page** (`index.html`) - Modern gradient design with navigation options
- **QR Scanner** (`qr.html`) - Real-time QR code generation and display
- **Phone Pairing** (`pair.html`) - Phone number input form for pairing

The frontend employs contemporary web design patterns with gradient backgrounds, glassmorphism effects, and responsive layouts using CSS Grid and Flexbox.

## Backend Architecture
Built on **Node.js with Express.js** framework following a modular routing structure:
- **Main server** (`bwmxmd.js`) - Entry point handling middleware and route registration
- **Route handlers** - Separate modules for QR (`qr.js`) and pairing (`pair.js`) functionality
- **Utility modules** - ID generation (`id.js`) and helper functions

The architecture implements a stateless design where each pairing session creates temporary authentication files that are cleaned up after use.

## Session Management
**Baileys WhatsApp Library** integration provides:
- Multi-device authentication state management
- Temporary session storage in `/temp` directory
- Automatic cleanup of expired sessions
- QR code generation for device linking
- Phone number verification for pairing

Sessions are isolated using unique identifiers and stored in temporary directories that are automatically removed after successful pairing or timeout.

## Enhanced Mega Integration (Pair-mega)
The extended version includes:
- **Mega.nz cloud storage** for persistent session backup
- **Session upload/download** mechanisms for cross-platform compatibility
- **Enhanced security** with cloud-based credential storage
- **PM2 process management** for production deployment

## Deployment Architecture
The application supports multiple deployment strategies:
- **Heroku** deployment with buildpack configuration
- **Vercel** serverless deployment 
- **Railway** cloud platform support
- **VPS/dedicated server** deployment
- Process management via PM2 for production environments

# External Dependencies

## Core WhatsApp Integration
- **@whiskeysockets/baileys** - Primary WhatsApp Web API library for multi-device support
- **qrcode** - QR code generation for device pairing
- **pino** - High-performance logging system

## Web Framework & Utilities
- **express** - Web application framework
- **body-parser** - HTTP request body parsing middleware
- **fs-extra** - Enhanced file system operations
- **path** - File path utilities

## Phone Number Processing
- **awesome-phonenumber** - International phone number validation and formatting
- **phone** - Phone number parsing and validation

## Cloud Storage (Mega Integration)
- **megajs** - Mega.nz cloud storage API client for session backup
- **uuid** - Unique identifier generation

## Development & Deployment
- **pm2** - Production process manager for Node.js applications
- **@hapi/boom** - HTTP error objects for Express
- **pastebin-js** - External paste service integration (currently disabled for security)

## Additional Services
- **node-fetch** - HTTP client for external API requests
- **unlimited-ai** - AI service integration
- Audio/media file hosting via external CDN services (catbox.moe)

The application integrates with external hosting platforms and CDN services for media delivery, with configuration support for various cloud deployment environments.
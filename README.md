
# 🚀 ALI-MD WhatsApp Bot Pairing Web

<div align="center">

![ALI-MD Banner](https://files.catbox.moe/6ku0eo.jpg)

[![GitHub Stars](https://img.shields.io/github/stars/ALI-INXIDE/ALI-MD?style=for-the-badge&logo=github&color=yellow)](https://github.com/ALI-INXIDE/ALI-MD)
[![GitHub Forks](https://img.shields.io/github/forks/ALI-INXIDE/ALI-MD?style=for-the-badge&logo=github&color=blue)](https://github.com/ALI-INXIDE/ALI-MD)
[![License](https://img.shields.io/github/license/ALI-INXIDE/ALI-MD?style=for-the-badge&color=green)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)

**A powerful WhatsApp bot pairing service with QR code scanning and phone number pairing capabilities**

[🌐 Live Demo](https://your-replit-url.replit.app) | [📱 WhatsApp Channel](https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h) | [💬 Support Group](https://chat.whatsapp.com/BJ5rQTBbOXv0PnKuPOXR8g)

</div>

## ✨ Features

- 🔗 **Multiple Pairing Methods**: QR Code scanning and phone number pairing
- 🎨 **Modern UI**: Beautiful glassmorphism design with animated gradients
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔒 **Secure Sessions**: Temporary authentication with automatic cleanup
- 🚀 **Fast Performance**: Built with Express.js and optimized for speed
- 🌍 **Multi-Device Support**: Full WhatsApp Web multi-device compatibility
- 📊 **Health Monitoring**: Built-in health check endpoints
- 🔄 **Auto Reconnection**: Intelligent connection management
- 🎵 **Audio Messages**: Automatic welcome audio messages
- 🧹 **Smart Cleanup**: Automatic session and temporary file management

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **WhatsApp Integration**: @whiskeysockets/baileys
- **Frontend**: HTML5, CSS3, JavaScript
- **File System**: fs-extra for enhanced file operations
- **Logging**: Pino for structured logging
- **QR Generation**: qrcode library
- **Process Management**: PM2 ready

## 📋 Prerequisites

- Node.js 20.0.0 or higher
- npm 9.7.2 or higher
- WhatsApp account for pairing

## 🚀 Quick Start

### Method 1: Deploy on Replit (Recommended)

[![Run on Replit](https://replit.com/badge/github/your-username/your-repo)](https://replit.com/new/github/your-username/your-repo)

1. Click the "Run on Replit" button above
2. Wait for the automatic setup to complete
3. Your pairing web is ready at your Replit URL!

### Method 2: Manual Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ALI-INXIDE/ALI-MD.git
   cd ALI-MD
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   ```
   http://localhost:5000
   ```

## 📖 Usage Guide

### 🔄 QR Code Pairing

1. Navigate to `/qr-scanner` or click "QR Scanner" on the homepage
2. Open WhatsApp on your phone
3. Go to Settings > Linked Devices > Link a Device
4. Scan the QR code displayed on the web page
5. Wait for the connection to establish

### 📱 Phone Number Pairing

1. Navigate to `/pair` or click "Phone Pairing" on the homepage
2. Enter your WhatsApp phone number (with country code)
3. Click "Get Code" to generate a pairing code
4. Open WhatsApp on your phone
5. Go to Settings > Linked Devices > Link a Device
6. Select "Link with phone number instead"
7. Enter the 8-digit code displayed on the web page

## 🏗️ Project Structure

```
├── 📁 routes/
│   ├── 📄 code.js      # Phone pairing route handler
│   ├── 📄 pair.js      # Pairing logic
│   └── 📄 qr.js        # QR code generation route
├── 📁 views/
│   ├── 📄 main.html    # Homepage
│   ├── 📄 pair.html    # Phone pairing interface
│   └── 📄 qr.html      # QR scanner interface
├── 📁 utils/
│   └── 📄 id.js        # Unique ID generation
├── 📁 public/
│   └── 📄 theme.css    # Styling
├── 📄 index.js         # Main server file
└── 📄 package.json     # Dependencies
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional):

```env
PORT=5000
HOST=0.0.0.0
NODE_ENV=production
```

### Custom Audio Messages

Modify the `audioUrls` array in `routes/code.js` to customize welcome audio messages:

```javascript
const audioUrls = [
    "your-custom-audio-url-1.mp4",
    "your-custom-audio-url-2.mp4",
    // Add more URLs as needed
];
```

## 🔍 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Homepage |
| `/qr` | GET | QR code generation |
| `/qr-scanner` | GET | QR scanner interface |
| `/code` | GET | Phone pairing code generation |
| `/pair` | GET | Phone pairing interface |
| `/health` | GET | Health check endpoint |

## 🐛 Troubleshooting

### Common Issues

1. **Connection keeps dropping**
   - Check your internet connection
   - Ensure WhatsApp Web is not open elsewhere
   - Try refreshing the page

2. **QR code not loading**
   - Check browser console for errors
   - Ensure all dependencies are installed
   - Verify port 5000 is not blocked

3. **Pairing code not working**
   - Ensure phone number includes country code
   - Try removing the "+" symbol
   - Check for any typos in the number

### Debug Mode

Enable debug logging by setting the log level:

```javascript
logger: pino({ level: "debug" })
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [Express.js](https://expressjs.com/) - Web framework
- [Replit](https://replit.com) - Development and hosting platform

## 📞 Support

- 💬 [WhatsApp Support Group](https://chat.whatsapp.com/BJ5rQTBbOXv0PnKuPOXR8g)
- 📢 [WhatsApp Channel](https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h)
- 🐛 [Report Issues](https://github.com/ALI-INXIDE/ALI-MD/issues)
- 📧 Email: support@ali-md.com

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ALI-INXIDE/ALI-MD&type=Date)](https://star-history.com/#ALI-INXIDE/ALI-MD&Date)

---

<div align="center">

**Made with ❤️ by [Ali Inxide](https://github.com/ALI-INXIDE)**

**If you find this project helpful, please consider giving it a ⭐**

</div>

# UMI Student Portal 📱💻

A Progressive Web App (PWA) for the University Management Information System - Student Portal. This application can be installed on desktop and mobile devices for a native app-like experience.

## 🚀 PWA Features

✅ **Desktop Installation** - Install on Windows, macOS, or Linux  
✅ **Mobile Installation** - Add to home screen on iOS and Android  
✅ **Offline Functionality** - Core features work without internet  
✅ **Service Worker** - Automatic caching and background updates  
✅ **Responsive Design** - Works perfectly on all screen sizes  
✅ **Native-like Experience** - Runs like a native application  

## 📱 Quick Install

### Desktop (Chrome, Edge, Firefox)
1. Open the app in your browser
2. Look for the install prompt or click the install icon (⬇️) in the address bar
3. Click "Install" and launch from your desktop

### Mobile
- **Android**: Tap menu → "Add to Home Screen"
- **iOS**: Tap Share → "Add to Home Screen"

📖 **Detailed installation guide**: See [PWA-SETUP.md](./PWA-SETUP.md)

## 🎓 Student Features

- **Dashboard**: View grades, assignments, and announcements
- **My Profile**: Manage personal information and academic records
- **Research Requests**: Submit and track research applications
- **Evaluations**: Complete course and instructor evaluations
- **Direct Messages**: Communicate with faculty and peers
- **Notifications**: Stay updated with important alerts
- **Settings**: Customize your portal experience

## 🛠️ Development

### Commands

```bash
# Development server
yarn dev

# Build for production (generates PWA files)
yarn build

# Preview built PWA
yarn preview

# Lint code
yarn lint
```

### PWA Development

PWA features only work in the built version. Use `yarn build` followed by `yarn preview` to test PWA functionality locally.

## 🔧 Tech Stack

- **React 19** - UI framework
- **Vite 6** - Build tool and dev server
- **Vite PWA Plugin** - Progressive Web App capabilities
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Workbox** - Service worker and caching strategies
- **Socket.io** - Real-time communications

## 📋 Browser Support

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Desktop Install | ✅ | ✅ | ✅ | ❌ |
| Mobile Install | ✅ | ✅ | ✅ | ✅ |
| Offline Support | ✅ | ✅ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |

## 🎨 Customization

The PWA can be customized by modifying:
- Icons in the `public/` directory
- Manifest settings in `vite.config.js`
- Service worker behavior via Workbox configuration
- Theme colors and branding (currently blue: `#2563eb`)

## 📚 Academic Workflow

1. **Login** → Access your student dashboard
2. **Check Dashboard** → View latest grades and announcements
3. **Submit Research Requests** → Apply for research opportunities
4. **Complete Evaluations** → Provide feedback on courses
5. **Manage Profile** → Update personal and academic information
6. **Stay Connected** → Use direct messages and notifications

---

**Ready for Academic Success!** Your UMI Student Portal is now a fully functional Progressive Web App, providing seamless access to your academic journey from any device. 🎓

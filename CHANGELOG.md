## 0.2.1 (2023-04-11)

### Fix

- mac os distributables and enable compression
- linux toolbar alignment

## 0.2.0 (2023-04-09)

### Feat

- make published zip files determinstic
- add toolbar with navigation buttons
- add reload and devtools shortcuts
- update tab title
- migrate to BrowserView based tab architecture
- add new tab button
- add keyboard shortcuts for tab management
- reject redirects
- add handling for forbidden requests, raw requests, and unresolved requests
- add support for forwarding api requests
- add support for upgrade to update calls and response verification
- add metadata cache
- load dapp directory titles from dapp metadata
- handle new tab actions and make directory apps links
- show favicons on homepage
- improve tabs
- switch from ic protocol to https for webauthn support
- add support for streaming
- refactor icp protocol logic into multiple files
- add body decoding support
- improve window customization and theming
- upgrade bootstrap and add dark mode support
- add tabs close button
- make tab list dynamic
- fetch requested asset from canister by path
- add canister actor creating via agent-js
- add embedded webviews
- add tabs layout
- add initial dashboard layout
- add initial bootstrap styles
- add empty ICP protocol registration
- initial commit

### Fix

- browser view y position on macos
- issue with preload.js file not working on packaged apps
- const enums are not preserved and files malformatted
- node-fetch version and app build
- use fixed position for toolbar
- remove webview devtools auto open
- update license and fix issue with dev tools opening in popup windows
- missing style preprocessor options on production

### Refactor

- rewrite ui in React and migrate to Electron builder build system
- merge tab manager and app window
- merge nav and tab component, separate into smart and dumb components
- full main process refactor
- simplify app directory
- move e2e testing into nested folder
- move src code to nested folders
- move ICP protocol code into separate files
- create layout components
- move dapp-listing-card to core directory

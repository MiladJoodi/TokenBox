# TokenBox 🗝️

**TokenBox** is a lightweight Chrome extension designed to make managing API tokens super easy and safe. Whether you're a developer testing APIs or just need to copy tokens quickly, TokenBox helps you handle everything in one place.

---

## 🚀 Features

- **Manage multiple roles** 🧑‍💻  
  You can create different roles like `admin`, `user`, etc. Each role stores its own credentials and last API response.

- **Save your credentials securely** 🔒  
  Store your username and password for each role. TokenBox remembers them so you don’t have to type them every time.

- **Receive API tokens instantly** ⚡  
  Send a request to your API and get the token back in one click.

- **Copy tokens easily** 📋  
  Copy the last received token for any role with a dedicated “Copy” button. The button is disabled if no valid token exists.

- **View last API response** 📄  
  For each role, you can see the last response from the API by clicking the “Last Response” button.

- **Edit or delete roles** ✏️❌  
  Modify credentials for any role or delete a role entirely with confirmation.

- **Smart UI & UX** 🎨  
  - Responsive layout and neat design  
  - Colored messages for success ✅ and errors ❌  
  - Only shows relevant buttons based on your actions  
  - Maintains last token even after closing the popup  

---

## 🛠️ How It Works

1. **Set API URL**  
   Click the `Change` button next to the URL display to edit your API URL. Press `Apply` to save it.  

2. **Add Roles**  
   Click the `+` button in the roles section to create a new role.  

3. **Add Credentials**  
   Select a role and click `Edit Credentials`. Enter your username and password and save.

4. **Get Token**  
   Click the `Receive Token` button to send a request to your API.  
   - If successful, the token is saved and displayed.  
   - The “Copy” button becomes active to copy the access token.  

5. **View Last Response**  
   Click the `Last Response` button to see the last API response for the selected role.  

6. **Delete Role**  
   Select a role and click the `Delete` button to remove it. A confirmation alert ensures you don’t delete by accident.

---

## 💾 Storage

TokenBox uses Chrome’s local storage to save:

- API URL
- Roles list
- Credentials for each role (username + password)
- Last received access token per role
- Last API response per role  

All data stays on your machine. Nothing is sent elsewhere.

---

## 🎨 UI Details

- Messages:  
  - ✅ Green = Success  
  - ❌ Red = Error  
  - ⚪ Gray = Info  

- Buttons:  
  - **Copy token** spans full width at the bottom.  
  - Action buttons (`Receive Token`, `Last Response`, `Delete`, `Edit Credentials`) show only when a role is selected.  
  - Disabled buttons turn gray if not clickable.

- Roles highlight when selected.  

---

## 🔧 Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `TokenBox` folder
4. Pin the extension for quick access

---

## 🧑‍💻 Usage Tips

- Always save your credentials before requesting tokens  
- Use separate roles for different API environments like `dev`, `staging`, and `prod`  
- The **Last Response** button is helpful for debugging API calls  

---

## 📌 Notes

- TokenBox only sends requests to the API URL you configure  
- Your data stays on your device and is never shared elsewhere  
- Works offline for viewing saved roles, responses, and credentials  

---

## 📝 Feedback and Contribution

If you enjoy using TokenBox or have ideas for improving it, feel free to open an issue or submit a pull request.

Made with ❤️ by **[Milad Joodi](https://www.linkedin.com/in/joodi/)**

